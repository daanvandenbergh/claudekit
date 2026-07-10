# Implementation snippets: consent, data-subject requests, retention, breach response

> Provenance: code patterns salvaged from the unlicensed `data-privacy-compliance` skill on
> 2026-07-05. That skill's legal claims were UNSOURCED and partly WRONG (e.g. a "48-hour"
> CCPA opt-out response, a pre-CPRA "Do Not Sell" link label, hardcoded penalty figures) -
> ALL legal claims were stripped during extraction; only implementation patterns remain.
> Read when: a policy run requires BUILDING a mechanism (consent banner, DSR handler,
> retention job) rather than just documenting one.
> Rule: these are illustrative pseudocode patterns, not drop-in code and not legal
> statements. Every legal parameter (timelines, categories, labels, durations) MUST come
> from the jurisdiction references or a live-verified source - never from this file.
> Verified: 2026-07-05 against live sources - line-by-line audit found zero statute
> numbers, deadlines, durations, legal labels, or figures stated as legal fact; the
> header warning above is accurate. Re-verify if older than 12 months.

## Data-subject-request handler patterns

The shape of each handler; the legal timeline and scope come from
`dpa-review-and-dsr-ops.md` and the jurisdiction references.

### Access request

```javascript
async function handleAccessRequest(userId, email) {
    const verified = await verifyIdentity(email);
    if (!verified) throw new Error("Identity verification failed");

    const userData = await collectUserData(userId); // across ALL systems

    const report = {
        personalInfo: userData.profile,
        activityLogs: userData.activities,
        preferences: userData.settings,
        thirdPartySharing: userData.dataSharing,
        // retention + contact fields: fill from the project's verified policy facts
    };

    await logAccessRequest(userId, "completed"); // compliance log
    return generateReport(report);
}
```

### Deletion request

```javascript
async function handleDeletionRequest(userId, email) {
    const verified = await verifyIdentity(email);
    if (!verified) throw new Error("Identity verification failed");

    // Legal retention check FIRST - partial deletion with documented basis if required
    const mustRetain = await checkRetentionRequirements(userId);
    if (mustRetain.required) {
        return {
            status: "partial_deletion",
            retained: mustRetain.data,
            reason: mustRetain.legalBasis,
            retentionPeriod: mustRetain.period,
        };
    }

    await Promise.all([
        deleteFromDatabase(userId),
        deleteFromBackups(userId), // or: mark for deletion in the next backup cycle
        deleteFromAnalytics(userId),
        deleteFromThirdPartyServices(userId), // every processor in the vendor inventory
        revokeAPIKeys(userId),
        anonymizeHistoricalRecords(userId),
    ]);

    await sendDeletionConfirmation(email);
    await logDeletionRequest(userId, "completed");
    return { status: "deleted", timestamp: new Date() };
}
```

### Portability request

```javascript
async function handlePortabilityRequest(userId, format = "json") {
    const userData = await collectUserData(userId);
    const portableData = {
        exportDate: new Date().toISOString(),
        userId,
        data: {
            profile: userData.profile,
            content: userData.userGeneratedContent,
            settings: userData.preferences,
            history: userData.activityHistory,
        },
    };
    if (format === "csv") return convertToCSV(portableData);
    if (format === "xml") return convertToXML(portableData);
    return portableData; // structured, commonly used, machine-readable
}
```

### Objection request

```javascript
async function handleObjectionRequest(userId, processingType) {
    switch (processingType) {
        case "direct_marketing":
            // must stop unconditionally
            await disableMarketing(userId);
            await updateConsent(userId, "marketing", false);
            break;
        case "legitimate_interest": {
            // stop unless documented compelling grounds exist
            const assessment = await assessLegitimateInterest(userId);
            if (!assessment.compelling) await stopProcessing(userId, processingType);
            return assessment;
        }
        case "profiling":
            await disableProfiling(userId);
            await updateConsent(userId, "profiling", false);
            break;
        default:
            throw new Error("Invalid processing type");
    }
    await logObjectionRequest(userId, processingType, "granted");
}
```

## Consent management patterns

Validity conditions, category definitions, and duration limits come from
`legal-bases-cookies-cnil.md` and `cookies-cnil.md` - not from here.

### Granular consent form

```html
<form>
    <h3>Privacy Preferences</h3>
    <label>
        <input type="checkbox" name="essential" checked disabled>
        <strong>Essential (required)</strong>
        <p>Necessary for the service to function</p>
    </label>
    <label>
        <input type="checkbox" name="analytics" value="analytics">
        <strong>Analytics</strong>
        <p>Usage measurement - describe the actual tool and purpose</p>
    </label>
    <label>
        <input type="checkbox" name="marketing" value="marketing">
        <strong>Marketing</strong>
        <p>Describe the actual purpose</p>
    </label>
    <button type="submit">Save preferences</button>
    <a href="/privacy-policy">Learn more</a>
</form>
```

### Consent record (proof of consent)

```javascript
const consentRecord = {
    userId: "user123",
    timestamp: new Date().toISOString(),
    consentVersion: "2.0", // version of the consent text shown
    purposes: {
        essential: { granted: true, required: true },
        analytics: { granted: true, purpose: "usage measurement" },
        marketing: { granted: false, purpose: "personalized advertising" },
    },
    ipAddress: "...", // proof - itself personal data, retain accordingly
    userAgent: "...",
    method: "explicit_opt_in",
};
await saveConsentRecord(consentRecord);
```

### Consent banner skeleton

```html
<div id="cookie-banner" role="dialog" aria-labelledby="cookie-title">
    <h2 id="cookie-title">Cookie preferences</h2>
    <p>Describe actual cookie use; link the cookie policy.</p>
    <!-- Accept and Reject MUST have equal prominence - no dark patterns -->
    <button onclick="acceptAll()">Accept all</button>
    <button onclick="rejectNonEssential()">Reject non-essential</button>
    <button onclick="showPreferences()">Manage preferences</button>
</div>
<script>
    // HARD RULE: no non-essential cookie/script may load before an explicit choice.
    // Gating must be real (scripts not loaded), not cosmetic (banner hidden).
    function acceptAll() {
        setConsent({ analytics: true, marketing: true });
        loadAnalyticsScripts();
        loadMarketingScripts();
        hideBanner();
    }
    function rejectNonEssential() {
        setConsent({ analytics: false, marketing: false });
        hideBanner();
    }
</script>
```

## Privacy-by-design patterns

### Data minimization

```javascript
// Bad: collecting fields the purpose does not need
// Good: only what the purpose requires
const userRegistration = {
    email: req.body.email,
    password: hashPassword(req.body.password),
    displayName: req.body.displayName, // optional
};
```

### Purpose limitation

```javascript
// Document allowed purposes per field; enforce at the accessor
const dataProcessingPurpose = {
    email: ["account_authentication", "order_confirmations", "password_reset"],
    phoneNumber: ["delivery_notifications"], // NOT marketing without separate consent
};

async function processData(data, purpose) {
    if (!isAllowedPurpose(data.type, purpose)) {
        throw new Error("Purpose not authorized for this data");
    }
}
```

### Retention enforcement job

```javascript
// Periods themselves come from the project's verified retention table
async function enforceRetentionPolicy() {
    const now = new Date();
    await User.deleteMany({
        lastActive: { $lt: subtractPeriod(now, RETENTION.inactiveAccounts) },
        status: "inactive",
    });
    await Analytics.updateMany(
        { createdAt: { $lt: subtractPeriod(now, RETENTION.analytics) } },
        { $unset: { userId: 1, ipAddress: 1 } }, // anonymize, keep aggregates
    );
    await MarketingConsent.deleteMany({
        $or: [{ expiresAt: { $lt: now } }, { withdrawnAt: { $lt: subtractPeriod(now, RETENTION.withdrawnGrace) } }],
    });
}
cron.schedule("0 2 * * *", enforceRetentionPolicy);
```

## DPIA working template

```markdown
# Data Protection Impact Assessment

## Processing overview
- Purpose: [describe the processing activity]
- Data types: [personal-data categories]
- Data subjects: [who is affected]
- Recipients: [who receives the data]

## Necessity assessment
- [ ] Is processing necessary for the stated purpose?
- [ ] Could the purpose be achieved with less data?
- [ ] Is the retention period justified?

## Risk assessment
| Risk | Likelihood | Severity | Mitigation |
|------|------------|----------|------------|
| Data breach | ... | ... | encryption, access controls |
| Unauthorized access | ... | ... | MFA, audit logs |
| Purpose creep | ... | ... | purpose documentation, training |

## Safeguards
- [ ] Encryption at rest and in transit
- [ ] Access controls and authentication
- [ ] Regular security audits
- [ ] Data minimization applied
- [ ] Retention policies enforced
- [ ] DPO consulted (where one exists)
- [ ] Data-subject-rights mechanism in place

## Conclusion
Processing is / is not acceptable with the proposed safeguards.
Signed: [responsible person]  Date: [date]
```

## Breach-notification email skeleton

Regulatory deadlines and content requirements come from the jurisdiction references; this is
only the communication shape.

```
Subject: Important security notice

Dear [name],

We are writing to inform you of a data security incident that may have affected your
personal information.

WHAT HAPPENED: On [date], we discovered that [brief description].
WHAT INFORMATION WAS INVOLVED: [specific data types] / [what was NOT involved]
WHAT WE ARE DOING: [immediate actions] / [ongoing enhancements] / [resources provided]
WHAT YOU CAN DO: [specific, actionable recommendations]
FOR MORE INFORMATION: [contact channel]

[Name, title]
```
