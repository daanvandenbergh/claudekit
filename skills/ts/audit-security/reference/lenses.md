# Lens catalog - the per-class review procedures

The checks Phase 40's sweep workers carry. Each is stack-neutral: resolve every project token (tenant key,
auth mechanism, validator, money type, logger, paid vendors) from `PROFILE` at audit time, then run the probe.
The idiom, borrowed from the sibling `/audit`: **coded id + named failure mode + concrete Probe + severity
Floor**, plus what correct/violation look like and the false-positive to avoid.

Two rules over the whole catalog:
- **A sink is a bug only when a source reaches it without a matching-grammar sanitizer.** Grep the sink, trace
  backward across files to a source; accept a path as safe only when it crosses a sanitizer that speaks *that
  sink's* grammar. `z.string()` stops Mongo operator-smuggling but is still raw for XSS/path/SSTI - same
  string, different grammar, different sanitizer. The per-ecosystem sink/source/sanitizer names are in
  `reference/sinks-and-sources.md`.
- **A lens that does not apply is recorded `N/A`, never silently passed.** No XML ingestion -> XXE is N/A; no
  user upload surface -> file-upload is N/A. Confirm the absence by the probe returning nothing, then say so.

Severity words are `reference/severity.md`. Floors are the *minimum*; escalate for reachability from an
unauthenticated entrypoint (E4) or crown-jewel data (E5).

---

## SEC-AC - Access control (OWASP A01:2025, the #1 category)

The governing sentence: **authenticated is not authorized.** Every check asks "authenticated as WHOM, to do
WHAT, on WHOSE object?" The three-step trace for every mode: (1) enumerate entrypoints (route handlers, server
actions/RPC, webhook handlers, resolvers, job triggers), (2) find where identity is established on THAT path,
(3) verify the check sits between identity and the data access, server-side, on the same path.

- **SEC-AC1. IDOR / BOLA - client-supplied object id trusted without an ownership check** (CWE-639,
  ASVS 8.2.2). Probe: grep every id sink - `params.id`, `searchParams.get(`, `body.<id>`, `[id]`/`[slug]`
  route dirs, GraphQL `args.id` - landing in `findOne`/`findById`/`updateOne`/`deleteOne`/`WHERE id =`/`.doc(`.
  Two high-yield greps for the ABSENCE: a filter keyed on ONLY the client id (`findOne({ _id: id })` with no
  tenant/owner predicate), and ownership derived from the REQUEST (`body.ownerId`) instead of the session.
  Check per-object mutations (`deleteDocument(id)`) individually - they skip the check the list path has.
  Correct: composite lookup `findOne({ _id: id, <tenantKey>: session.<tenantKey> })` (a miss returns "not
  found", never another's row), or fetch-then-assert `obj.ownerId === principal.id`. Violation:
  `findById(params.id)` returned/mutated with no owner predicate; ownership "verified" against a body value.
  Floor: cross-principal read of PII/business data = **High**; write/delete/state-change, or guessable
  sequential ids, or generalizing across the collection = **Critical**. FP-trap: opaque GUID ids are
  defense-in-depth, NOT a substitute for the check - do not clear a finding because ids "aren't guessable".

- **SEC-AC2. BFLA - a privileged operation reachable without a function/role check** (CWE-862, ASVS 8.2.1).
  **The trap this class ships broken through: a server action / RPC dispatched by id runs BEFORE any
  layout/page renders, and the POST can target any route - so a gate in a layout or a page-level `notFound()`
  is NOT on the action's path, and `getSession()` establishes who but does not gate what.** Probe: enumerate
  every privileged/mutating entrypoint independently of the UI that calls it - `"use server"` exports,
  `export async function POST|PUT|PATCH|DELETE`, everything under the admin path prefix, GraphQL mutations, RPC
  registrations. For each, confirm the handler's OWN body calls the role check (not a parent layout, not a
  hidden button). Method-parity grep: a `GET` that checks and a `DELETE`/`POST` on the same resource that
  doesn't is the BFLA. Best structural signal: does a red test enumerate every dispatchable privileged surface
  and assert each gates? A new admin action not covered by it is a finding. Correct: deny-by-default; every
  admin/mutating handler calls a shared authorization chokepoint in its own body, re-checked per dispatch.
  Violation: a `"use server"` action or POST handler with no role assertion in its body; reliance on a layout
  gate the dispatch bypasses. Floor: reaching a privileged read = **High**; a state-changing/privilege-granting
  function, or anything on the admin plane = **Critical** (an ungated server action defaults Critical - the
  dispatch bypasses every perimeter control).

- **SEC-AC3. Multi-tenant isolation - tenant key not from the principal, or filter applied too late**
  (ASVS 8.4.1). The single most important trace: for every use of the tenant key, where did it COME FROM?
  Correct = from the verified session/token; violation = read from `body`/`query`/`params`/a header (grep
  `body.<tenantKey>`, `searchParams.get("<tenantKey>")`, any tenant id in a request Zod schema that reaches a
  filter) - an attacker-chosen filter authorizes nothing. Probe also: every domain query filters on the tenant
  key (grep `find(`/`aggregate(`/`updateMany(` on domain collections lacking it); and in aggregation
  pipelines the tenant `$match` is the FIRST stage (grep `aggregate([` whose first element is not
  `{ $match: { <tenantKey> ... } }`; any `$lookup` on a tenant collection needs its own scoped sub-pipeline - a
  lookup before the scope reads across tenants and a later `$match` cannot un-leak it). For an agent with no
  session (a voice/phone agent), the tenant scope must come from a signed token WE minted, never the
  transcript/body. Correct: tenant context from verified auth, threaded explicitly to every accessor; present
  in every read/write/cache-key/storage-path; `$match` first. Floor: **Critical** - a cross-tenant break rarely
  affects one object, and one field leaked jumps to Critical the moment it generalizes or the path can write.
  FP-trap: a deliberately GLOBAL cache carrying no tenant/PII (a string->place geocode cache) is intentionally
  un-scoped - distinguish "carries no tenant data" from "carries tenant data and forgot to scope".

- **SEC-AC4. Mass-assignment / BOPLA - a request body binds a field it must not control** (CWE-915,
  ASVS 8.2.3). The mechanism that turns "edit my own profile" into vertical escalation ("set `role: admin`").
  Probe: grep whole-body binds - `new Model(req.body)`, `Object.assign(doc, body)`, `updateOne({...}, { $set:
  body })`, `{ $set: { ...input } }`, ORM `create(body)`/`update(body)`. Then check the field allowlist: a
  boundary DTO listing exactly the writable fields, or does it pass unknown keys? `z.object({...}).passthrough()`
  or a schema that INCLUDES `role`/`<tenantKey>`/`ownerId`/`price` as input still mass-assigns. Hunt these
  fields on the WRITE side: `role`, `roles`, `permissions`, `isAdmin`, tenant id, `ownerId`, `emailVerified`,
  `plan`, `price`/`amount`/`balance`. Correct: allowlist DTO; sensitive fields structurally unsettable from a
  request (e.g. `input: false`), stamped server-side from the principal. Violation: `$set: body` reaching a
  persisted doc; a role/owner/tenant/price field present in the accepted input schema; `.passthrough()` on a
  boundary DTO. Floor: setting role/owner/tenant/price = **Critical**; mass-assign of a non-sensitive field
  only = **Medium** (but you must prove NO sensitive field is reachable to claim that floor).

**The per-entrypoint six-answer probe** (run for every enumerated entrypoint; any "no / from-request / after"
is a finding at the floor above): 1. Identity established server-side on THIS path? 2. Client id gated by an
ownership/tenant predicate before the data op? 3. Role asserted in the handler's OWN body, not a layout the
dispatch skips? 4. Tenant key from the principal, present in the query, in the FIRST pipeline stage? 5.
Sensitive fields (role/owner/tenant/price) unsettable from input? 6. Deny-by-default - no branch where a
missing/empty check means "allow"? The strongest finding is not "this handler forgot a check" but "there is no
shared chokepoint, so N handlers each re-implement it and one forgot" - fix at the chokepoint, leave the
enumerating test.

---

## SEC-AUTH - Authentication and session management (OWASP A07:2025; API2:2023 Broken Authentication)

The governing sentence: **a password is not a session.** Every failure is one of two shapes - a credential
trusted too cheaply (weak hash, no throttle, an enumerable error), or a session minted too early / trusted too
long (before the second factor, past logout, keyed on a row the attacker can delete). All fail SILENTLY: the
happy path logs in fine, nothing warns you the guard is on the wrong side of the door. The trace for every
check: find where the credential is verified, where the session is minted, and confirm nothing consequential
happens between them out of order. Resolve `<trustedIpResolver>`, `<kdf>`, `<sessionStore>`,
`<credentialChangeChokepoint>` from PROFILE. JWT crypto-verify is **SEC-SEC4**; session-cookie flags are
**SEC-SUP9**; OAuth `redirect_uri` open-redirect is **SEC-WEB6**; `Math.random` tokens and timing-unsafe
compare are **SEC-SEC2 / SEC-SEC7** - cross-referenced, not re-derived. This lens owns auth-flow ORDERING and
token/session BINDING.

- **SEC-AUTH1. Credential storage - a fast hash as the password KDF, or a missing salt/pepper** (CWE-916/759/256,
  ASVS 6.5.2). A general-purpose primitive (`sha256`/`sha1`/`md5`/bare `createHash`) on a low-entropy human
  secret is a GPU/rainbow target. Probe: grep the password field's write-side (`createHash(`/`hashlib.`/
  `MessageDigest` feeding a `password`/`passwordHash`) and the verify-side compare. Confirm an adaptive
  memory-hard KDF at current factors: argon2id (>=19 MiB, t>=2), scrypt (N>=2^17), bcrypt (cost>=10, and note
  the 72-byte truncation - a >72-byte input must be pre-hashed `base64(hmac-sha384(pw))` or a null byte caps
  it), or PBKDF2-HMAC-SHA256 >=600k. Correct: per-user salt (the KDF does this) + a pepper applied as an HMAC
  with a secret kept OUTSIDE the DB, so a DB dump alone is uncrackable; legacy fast hashes wrapped and rehashed
  on login. Violation: `sha256(password)`; unsalted/global-salt; plaintext/reversible; bcrypt fed >72 bytes
  un-prehashed. Floor: **High**; **Critical** for plaintext/reversible or a fast-hash on the primary password.
  FP-trap: this is the PASSWORD path only - a high-entropy random API key/opaque session token needs no slow
  KDF (a peppered HMAC is correct); low-entropy OTP/reset codes are SEC-SEC1.
- **SEC-AUTH2. Password policy and breached-password check** (CWE-521, ASVS 6.2.x). Probe: the register/change
  validator. Correct: min 8 (15+ recommended), max permitted >=64, all characters allowed, and new passwords
  screened against a breached set (Pwned Passwords k-anonymity, or an offline top-N) - the highest-value control
  after MFA against stuffing. Violation: a `max` of 20/32 that blocks passphrases; forced composition rules with
  no breach check; no breach check at all. Floor: no breach check on an internet-facing signup = **Medium**
  (High if the app has no MFA). FP-trap: absence of composition rules is CORRECT per current NIST/ASVS - do NOT
  report "allows all-lowercase"; the finding is the MISSING breach screen, not missing complexity.
- **SEC-AUTH3. Brute-force / credential-stuffing throttle, and a lockout that survives destruction of its own
  record** (CWE-307/799, ASVS 6.3.1). Probe: at the login handler find the counter that bounds guesses. Two
  independent limits required - per-ACCOUNT and per-SOURCE-IP - and the IP MUST come from `<trustedIpResolver>`,
  never a raw `X-Forwarded-For`. The structural check: **where does the counter LIVE?** A field on the user/
  credential row is deleted by a verify / account-delete / factor-change, and `attempt -> reset -> attempt` is
  an unthrottled loop; it must be its own store keyed on a stable value (HMAC of the identifier) that outlives
  the record. The guess counter is an atomic `$inc`/`findOneAndUpdate` (read-then-increment lets parallel
  guesses pass - SEC-BL1). Violation: one dimension only; IP from a spoofable header; the counter co-located
  with the row it guards. Floor: **High**; **Critical** when unauthenticated and reaching a paid side effect
  (SMS/email-per-attempt = denial-of-wallet, SEC-BL4). FP-trap: **an edge/WAF rate limit is NOT a per-account
  lockout** - a distributed stuffing run stays under a per-IP ceiling; do not clear this because "Cloudflare
  rate-limits us." Account-lockout-only (no IP dim, no backoff) is itself a DoS - prefer throttling + MFA.
- **SEC-AUTH4. User enumeration and timing oracles** (CWE-204/203/208, ASVS 6.3.8). Probe: compare the response
  for a KNOWN vs UNKNOWN identifier on login, registration, and reset - message text, status, redirect, JSON
  shape, OR response time (a real password runs the slow KDF; a missing user short-circuits = a timing oracle).
  Correct: one generic outcome per pair ("if that email has an account, we've sent a link"), identical status/
  shape, constant-time (run the KDF against a dummy hash even when the user is absent). Violation: distinct copy/
  status per case; registration revealing existing accounts; reset 200 for real emails and 404 for unknown.
  Floor: **Low** standalone; **Medium** when it feeds a stuffing/spraying campaign. FP-trap: a registration form
  cannot let two accounts share an email - the fix is "check your email" + out-of-band collision handling, NOT
  inline "already taken"; flag the inline disclosure, not the uniqueness constraint.
- **SEC-AUTH5. MFA/2FA flow integrity - a session minted before the second factor, or a flag set before its row**
  (CWE-287/308, ASVS 6.3.3/7.2.4). (a) Session-before-factor: the password step must mint NO usable session -
  it returns "second factor required" and ONLY factor-verify creates the session; probe the password handler
  for a session cookie/real token issued THEN the OTP "required" (a client just replays the already-valid
  cookie); the OTP page must gate on a pre-auth token, not a live session. (b) Flag-before-row: enrolment writes
  the verifier ROW before the "MFA required" FLAG; a flag set before its verifying secret exists is a permanent
  lockout fixable only in the DB. Correct: password verify returns `{mfaRequired}` + a short single-use pre-auth
  token, no session; factor-verify atomic + single-use (`findOneAndDelete`, not a bare delete) + rate-limited +
  constant-time; enrol row-before-flag; backup codes CSPRNG, one-time, hashed. Floor: session minted before the
  second factor = **Critical**; flag-before-row lockout = **High**. FP-trap: a single-use signup/email-verify
  LINK that lands in the very inbox the code would is NOT a bypass; "remember this device" waiving the SECOND
  factor is by-design (SEC-AUTH6), waiving the FIRST is not.
- **SEC-AUTH6. Account recovery / password reset** (CWE-640/620/598, ASVS 6.4.x/7.4.3). The reset flow is a
  second front door; make it as strong as login. Probe the token: CSPRNG >=128 bits (SEC-SEC2), stored HASHED,
  SINGLE-use (atomic claim), time-bound (TTL re-checked against the clock in code, not a TTL sweeper). Probe the
  transport: the token must not ride a logged URL, leak via `Referer` (`Referrer-Policy: no-referrer` on the
  reset page), or be built from a caller-supplied `Host` header (host-header poisoning redirects the link - grep
  reset-link construction for `req.headers.host`/`X-Forwarded-Host`). Probe the aftermath: on reset, invalidate
  ALL sessions (SEC-AUTH8) AND call `<credentialChangeChokepoint>` to forget every trusted device (SEC-AUTH9).
  Correct: opaque single-use expiring hashed token, delivered to the pre-registered channel, no auto-login, a
  "your password changed" notice, uniform response (SEC-AUTH4). Floor: **High**; **Critical** for a guessable/
  reusable token or a reset that leaves old sessions/devices live. FP-trap: deliberately having NO backup-code
  recovery path is a design choice, not a missing control - do not flag its absence.
- **SEC-AUTH7. Session fixation and rotation** (CWE-384, ASVS 7.2.4). If the pre-auth id survives into the
  authenticated session, an attacker who planted it rides the elevated session. Probe: at login and at any
  privilege elevation, a NEW session token is minted and the OLD terminated; for JWT sessions, "regenerate" =
  a fresh token bound to the new level with the old jti denylisted. Correct: `session.regenerate()` / new signed
  token on every authentication and re-auth, old invalidated. Violation: the pre-login id survives; role
  escalation without re-mint. Floor: **High**. FP-trap: a framework that issues the cookie only AT login (no
  anonymous session) is not fixation-vulnerable on that path - confirm a pre-auth id genuinely survives.
- **SEC-AUTH8. Session timeout and termination - server-side limits, and logout that deletes the row not the
  cookie** (CWE-613, ASVS 7.3.x/7.4.1). Probe: (a) idle AND absolute limits enforced on the SERVER (a cookie
  `Max-Age`/JWT `exp` the client can ignore is not enforcement; the `<sessionStore>` row carries `lastSeenAt` +
  `createdAt` and rejects on either bound); (b) logout DELETES the server-side row / revokes the token, not just
  `clearCookie` (a captured cookie replayed after "logout" still works; a stateless JWT needs a revocation
  list); (c) password/factor change terminates OTHER sessions. Correct: store-checked timeouts; logout is a
  server-side delete/revoke. Floor: **Medium**; **High** for a self-contained JWT with no revocation (logout/
  reset cannot kill a live session) or a session reaching cross-tenant/admin data. Cookie flags are SEC-SUP9.
- **SEC-AUTH9. Persistent "remember me" / trusted device** (CWE-539/565, ASVS 7.x). A long-lived bearer
  credential, safe only if: (1) HMAC-bound to the user and naming a SERVER-SIDE row (not a self-authenticating
  `remember=1` or unsigned id), so revocable and unforgeable; (2) rotates single-use (a reused old token is dead
  and detectable); (3) waives ONLY the second factor, NEVER the first (grep: does it skip to a session, or skip
  only the OTP?); (4) audited AND notified; (5) `<credentialChangeChokepoint>` forgets all devices on any
  credential change; (6) REFUSED - a hard 400, never a silent no-op - on any staff/admin plane. Violation: a
  self-contained/unsigned remember cookie; skipping the password; non-rotating; not revoked on credential
  change; honoured on the admin plane. Floor: skips the first factor or is forgeable/non-revocable = **Critical**;
  missing rotation/notification/audit, or accepted on the staff plane = **High**. FP-trap: waiving only the
  SECOND factor for a bound, revocable, notified device is intended - the bug is skipping the PASSWORD, forgery,
  or no revocation.
- **SEC-AUTH10. OAuth/OIDC/SAML as a CONSUMER - missing state/PKCE/nonce, loose redirect_uri, or an ID token
  decoded but not validated** (CWE-352/347/601, ASVS 10.x). Ships broken by omission: a callback that reads
  `code`/`id_token` from the query and mints a session with no binding checks. Probe the REQUEST: `state`
  generated/stored/compared (login-CSRF), PKCE `code_challenge` (public clients), `nonce` (OIDC). Probe the
  CALLBACK: `redirect_uri` EXACT-match against a pre-registered allowlist (no prefix/wildcard/`?next=`
  laundering - SEC-WEB6); `state` checked first; the code exchanged server-side (never the implicit token/
  id_token fragment). Probe ID-TOKEN validation: fully VERIFIED not `jwt.decode`'d - signature against pinned
  JWKS (SEC-SEC4), `iss` exact, `aud` == our client_id, `exp`/`iat` in range, `nonce` matches; bind identity
  from the verified `sub`, NEVER a `user_id`/`email` in the callback query. SAML: validate the signed element
  (guard signature-wrapping), enforce Audience/Recipient/NotOnOrAfter, check the assertion id for replay.
  Violation: **a callback with no `state`** (the documented ship-broken gap); loose redirect_uri; an
  `id_token` decoded and trusted; identity from the query; implicit flow. Floor: **High**; **Critical** when it
  yields account takeover. FP-trap: PKCE can substitute for `state` (ASVS 10.2.1) - do not double-flag a
  PKCE-only client; the finding is when NEITHER binds the callback to the initiating session.
- **SEC-AUTH11. Self-contained session/ID tokens trusted beyond a verified signature** (CWE-347/345, ASVS 9.x).
  SEC-SEC4 owns the crypto probe (`decode` not `verify`, `alg:none`, no pinned `algorithms:`, RS256->HS256
  confusion); this adds the claim-binding failures: (1) an algorithm ALLOWLIST excluding `none` and no symmetric+
  asymmetric mix; (2) key material from a pre-configured trusted source only - `kid`/`jku`/`x5u`/`jwk` headers
  validated against an allowlist, never used to fetch/read an attacker-named key (kid path-injection to
  `/dev/null` signs with an empty secret); (3) `exp`/`nbf` enforced; (4) `aud`/`iss` bound so a token for
  another service is rejected; (5) a token-type/purpose claim so a reset token cannot replay as a session; (6)
  NO secret/PII in the payload (base64, not encrypted). Correct: `verify(token, key, {algorithms:['<pinned>'],
  audience, issuer})`, key from a pinned JWKS/env, expiry present, type-scoped. Floor: **Critical** for missing
  signature-verify / `alg:none`/confusion / attacker-controlled key source; **High** for missing `aud`/`iss`/
  `exp`/type; secret-in-payload = **High** (Critical for a signing key - rotate it). FP-trap: an opaque RANDOM
  reference token looked up in `<sessionStore>` is NOT self-contained - none of this applies.

**The authentication order-of-operations** (a "wrong order" on any line is a finding at the floor above): 1.
credential verified through a slow KDF, constant-time, before any session exists? 2. throttle counter atomic
and living OUTSIDE the record it guards, keyed on a trusted IP and the account? 3. session minted ONLY after the
second factor? 4. MFA row committed BEFORE the flag? 5. session id regenerated on login and every privilege
gain? 6. logout / reset / factor-change DELETE server-side sessions and FORGET trusted devices, not just clear a
cookie? 7. every long-lived or self-contained token verify-before-trust, revocable, expiry- and audience-bound?
The strongest finding is "there is no shared chokepoint for credential-change side effects, so reset does it and
the settings page does not" - fix at the chokepoint, leave the enumerating test.

---

## SEC-INJ - Injection, cross-file (OWASP A03; the class free Semgrep structurally misses)

Sink names per ecosystem: `reference/sinks-and-sources.md`. The engine is the backward taint walk: anchor at
the sink, name the required sanitizer for its grammar BEFORE reading the code (so a wrong-grammar validator
can't fool you), walk backward through every call site across files to a source, accept only a matching
sanitizer. Grep every CALLER of an accessor, not just the one you started from - a sibling caller that skips
validation is the bug.

- **SEC-INJ1. SQL / NoSQL, incl. operator-smuggling** (CWE-89). The headline NoSQL case: a JSON body/query
  value landing as a FIELD VALUE inside a Mongo filter without boundary type-narrowing - a body of
  `{"id":{"$ne":null}}` arrives as `filter._id = {$ne:null}`, an OPERATOR that matches the first live doc in
  the tenant; `{"$gt":""}` matches every non-empty string; `{"$where":"…js…"}`/`$regex`/`$expr`/`$function`
  enable eval/DoS. Sanitizer: narrow to a primitive at the boundary (`z.string()`/`z.number()`/ObjectId
  coercion) so an object is structurally rejected; parameterize SQL; never spread a body object into a filter.
  Floor: reachable = **Critical**.
- **SEC-INJ2. Command / eval / dynamic code** (CWE-78, CWE-94). Sink: `exec`/`execSync`/backticks/`spawn(...,
  {shell:true})`; `eval`/`new Function`/`vm.*`/dynamic `import()` of a computed value. Sanitizer:
  argument-array exec with no shell (metacharacters become literal data) + command allowlist; for eval sinks
  there is no safe sanitizer, the fix is to not eval input. Floor: reachable = **Critical**.
- **SEC-INJ3. Path traversal, zip-slip, temp-file race** (CWE-22, CWE-377/59). Sink: `fs.*`/`sendFile`/
  `path.join(base, userInput)`. Sanitizer: canonicalize (`realpath`/`resolve`) THEN assert
  `resolved.startsWith(base + sep)` - containment checked AFTER normalization (a `startsWith` on the pre-resolve
  string is defeated by `..`; note `path.join`/`filepath.Join` clean but do NOT contain `..`). **Zip-slip:**
  archive extraction (`unzip`/`tar`/`AdmZip`/`zipEntry.getName()`) must validate EACH entry's resolved target is
  inside the base dir after normalization - the same containment rule, per entry. **Temp-file race:** a temp
  file created with a predictable name in a shared dir (`/tmp/app-<n>`) without `O_EXCL`/`mkstemp` is a symlink
  race - grep `writeFile`/`open` on a non-random path in a world-writable dir. Floor: **High** (Critical if it
  reads secrets); temp-file race = **Medium**.
- **SEC-INJ4. SSTI** (CWE-1336). Sink: a template engine where the template STRING is built from input
  (`render(userString)`) vs `render(fixedTemplate, {data})`. Probe: `{{7*7}}`/`${7*7}` -> `49`. Sanitizer:
  input flows only as data into a fixed template, never as template source. Floor: **High** (Critical where the
  engine reaches OS exec - Jinja2/Twig/Freemarker gadgets).
- **SEC-INJ5. Prototype pollution** (CWE-1321). Sink: recursive `merge`/`set`/`defaultsDeep`, `obj[userKey]=`,
  deep-assign of parsed JSON carrying `__proto__`/`constructor`/`prototype`. Sanitizer: reject the three magic
  keys, `Object.create(null)`/`Map`, Zod-strip unknown keys. Floor: **High** when it reaches an authz/RCE sink,
  Medium when DoS-only.
- **SEC-INJ6. Unsafe deserialization / XXE** (CWE-502, CWE-611). Sink: native/polymorphic deserializers
  (`pickle`/`yaml.load`-unsafe/`ObjectInputStream`/`XMLDecoder`/`unserialize`/`Marshal.load`), XML parsers with
  entity expansion. Sanitizer: don't deserialize untrusted data; class allowlist / HMAC-sign / repopulate a
  validated object; safe YAML loader; disable DTD/external entities. Floor: native deserializer + gadget =
  **Critical**. FP-trap: `JSON.parse` on request bodies is SAFE (plain data, not typed objects) - never flag it;
  Zod-validated JSON parsing is the correct pattern.

---

## SEC-WEB - Modern-web high-severity classes

- **SEC-WEB1. XSS** (CWE-79). Sink: `dangerouslySetInnerHTML`, `.innerHTML`/`outerHTML`/`insertAdjacentHTML`,
  `document.write`, `v-html`, `res.send(html)`, unescaped JSON-LD/metadata; DOM sources
  `location`/`location.hash`/`document.referrer`/`window.name`/`postMessage`. Correct: framework auto-escaping
  (JSX `{value}`); DOMPurify for HTML you must render; validate URL scheme for `href` (`javascript:` bypasses
  auto-escape). **Stored / second-order (the highest-value case): enumerate every DB field written from a
  request AND every render sink that reads persisted content, and point the taint pass at persistence as a
  FIRST-CLASS source, not only request bodies** - a value written by tenant A (a name, a transcript) then
  rendered into tenant B's or a staff/admin session is the dangerous flow, which needs the taint pass to bridge
  two different entrypoints THROUGH the datastore. Floor: reflected/DOM in an authed context = **High**; stored
  XSS rendering into another tenant or a staff/admin session = **Critical**. FP-trap: a sink fed by a constant or already-sanitised/MDX-compiled
  value is not a bug - flag the tainted FLOW, not the sink; and `<div>{name}</div>` is the framework working,
  not a finding.
- **SEC-WEB2. SSRF** (CWE-918). Sink: `fetch`/`axios`/`http.request`/`got` whose URL, host, or a path segment
  comes from request data / a DB field a caller wrote / a transcript. Hides behind webhook-URL registration,
  "import from URL", avatar-by-URL, PDF/screenshot renderers, geocoders. Correct: allowlist destinations
  (usually one vendor host); for arbitrary user URLs - scheme allowlist, resolve host, reject non-global IPs
  (RFC1918/loopback/link-local `169.254.0.0/16`), connect to the validated IP, disable redirect-following.
  Floor: **High**; **Critical** when the fetch can reach cloud metadata creds (`169.254.169.254`) or internal
  admin/DB. FP-trap: a fetch to a HARDCODED vendor endpoint with only a validated id interpolated is NOT SSRF
  (host not attacker-controlled); a client-side `fetch` is not SSRF.
- **SEC-WEB3. Unsafe file upload** (CWE-434). Sink: `multer`/`formidable`/`busboy`/`move_uploaded_file`. Probe:
  on-disk name from `originalname`? type decided by `mimetype`/`Content-Type` (spoofable) or magic bytes? size
  cap? served from an executing/inline path? Correct: extension allowlist, random UUID filename, magic-byte
  check, size limit, store off-webroot / different host, serve via indirection with `Content-Disposition:
  attachment`. Floor: executable content on a served/executing path = **Critical** (webshell); SVG/HTML served
  inline = **High**. FP-trap: uploads straight to object storage under a server-generated key, never served
  from an executing origin, are not RCE.
- **SEC-WEB4. XXE** - see SEC-INJ6. Commonly **N/A** in a JSON app (no XML ingestion) - confirm and record N/A.
- **SEC-WEB5. Insecure deserialization** - see SEC-INJ6. Commonly **N/A** in a Node/JSON app - but run the
  prototype-pollution probe (SEC-INJ5) instead.
- **SEC-WEB6. Open redirect / CORS - the RESTRAINT pair (over-reporting these erodes trust in the whole
  audit).** Open redirect (CWE-601): a redirect target from `?next=`/`returnUrl`/`redirect_uri` echoed into
  `Location`/`window.location`; weak `startsWith("/")` guards are bypassed by `//evil.com`/`/\evil.com`. Floor:
  **Low**, escalating to Med/High only when it launders an OAuth/OIDC `redirect_uri` or a token, or phishes on
  the auth domain. CORS (CWE-942): the finding is the CONJUNCTION - an `Origin` reflected (or `*`/`null`) into
  `Access-Control-Allow-Origin` AND `Access-Control-Allow-Credentials: true` on an endpoint returning
  authenticated data. Floor: **Low**; **High** only with that conjunction. FP-trap (the big one): `ACAO: *`
  alone is NOT a vulnerability - browsers forbid `*` with credentials, so a wildcard without `ACAC:true`
  exposes only what any anonymous client could already fetch. Only flag CORS when credentials are in play and
  the origin is attacker-influenced.

---

## SEC-CLIENT - Client-side / browser security (ASVS V3 Web Frontend + V14 Data Protection; WSTG client-side)

The governing sentence: **the browser is the attacker's execution environment, not yours.** Every check assumes
one XSS or one hostile embedder and asks what it can then read, send, or drive. Two rules: **(1) a header only
counts where it reaches the browser** - trace the response THROUGH the edge/CDN before flagging one "missing"; a
header injected at the edge is present. **(2) Presence is not effectiveness, and effectiveness is not
universally required** - a CSP with `unsafe-inline`, a `target=_blank` a modern browser already hardened, an
XFO obsoleted by `frame-ancestors` are non-findings; reporting them erodes trust in the whole audit.

- **SEC-CLIENT1. Auth token / PII in client storage, or shipped in the bundle / prod source maps** (CWE-522/540,
  ASVS 14.3.3/14.3.1). Probe: grep `localStorage.setItem`/`sessionStorage.setItem`/`indexedDB`/`window.name =`
  and trace the VALUE - a JWT/session token/`apiKey`, or customer PII? Anything JS-readable is stolen wholesale
  by one XSS; an `HttpOnly` cookie is not. Separately grep the build config for prod source maps
  (`productionBrowserSourceMaps: true`, a served `.map`) and the bundle for a non-`NEXT_PUBLIC` value or tenant
  data passed into a `"use client"` component (overlaps SEC-SEC6). Correct: session token in `HttpOnly`+`Secure`
  cookie; nothing sensitive in web storage; source maps off/auth-restricted in prod; only publishable values in
  client code; authenticated data cleared on sign-out (`Clear-Site-Data`). Floor: auth token or cross-tenant PII
  in JS-readable storage = **High**; a live secret in the bundle = **Critical** (SEC-SEC6); PII-only = **Medium**.
  FP-trap: ASVS carves out session tokens as the one storage exception for a cookie-less SPA (rate Medium,
  prefer the cookie); non-sensitive UI state (theme, last tab) in `localStorage` is fine; a source map behind
  auth or only in a non-prod build is not a leak.
- **SEC-CLIENT2. postMessage without an origin check (receive), or `targetOrigin: '*'` for sensitive data (send)**
  (CWE-345/346, ASVS 3.5.5). Probe: grep `addEventListener("message"`/`onmessage` - does the handler's FIRST act
  compare `event.origin` to an allowlist by EXACT FQDN (never `origin.indexOf(".mydomain")` - beaten by
  `evil-mydomain.com`) AND shape-validate `event.data`? Send side: `.postMessage(` with `"*"` carrying token/PII.
  Correct: receive - `if (event.origin !== EXPECTED) return;` then Zod `event.data`; send - explicit target
  origin. Floor: receive driving a state change/auth = **High**, else Medium; send-side `"*"` leaking token/PII =
  **High**. FP-trap: a strict `===` origin check is correct; `postMessage("...", "*")` of already-public data (a
  resize ping) is fine; framework-internal postMessage (Next.js HMR, an analytics iframe) is not your code.
- **SEC-CLIENT3. Clickjacking on a sensitive / state-changing page - no `frame-ancestors`** (CWE-1021, ASVS
  3.4.6). Promotes the SEC-SUP9 footnote to a real check for sensitive pages. Probe: enumerate sign-in, 2FA/OTP,
  payment, account/settings, admin, any one-click irreversible action, and confirm each response carries
  `Content-Security-Policy: frame-ancestors 'none'` (or a tight allowlist) - grep the CSP config for
  `frame-ancestors`. Correct: `frame-ancestors 'none'`/`'self'` applied globally via headers/middleware. Floor:
  sensitive state-changing page framable = **Medium**; a one-click irreversible action framable = **High**.
  FP-trap: `X-Frame-Options` is obsolete - a page WITH `frame-ancestors` does not also need XFO; a static
  marketing page being framable is the SEC-SUP9 Low footnote, not a finding here.
- **SEC-CLIENT4. Reverse tabnabbing on a user/DB-controlled link; missing SRI on an external script** (CWE-1022/
  353, ASVS 3.6.1/3.4.8). Probe: (a) `target="_blank"` and `window.open(` where the href is user/DB-controlled -
  the opened page gets `window.opener` and can navigate your tab to a phishing clone; (b) `<script src=`/`<link
  href=` at a third-party host with no `integrity=`. Correct: `rel="noopener noreferrer"` on external
  `target=_blank`, `noopener,noreferrer` in the `window.open` feature string; `integrity` + `crossorigin` on
  every external asset (or self-host); `Cross-Origin-Opener-Policy: same-origin`. Floor: tabnabbing on a user/DB
  href = **Low-Medium**; external script no SRI = **Medium** (High on an authed/payment page). FP-trap (the big
  one): **modern browsers already imply `noopener` for anchor `target=_blank`** (Chrome 88+/FF 79+/Safari
  12.1+) - a plain `<a target="_blank">` is NOT a finding; the real gaps are `window.open()` (NOT noopener by
  default) and an explicit `rel` without noopener. SRI is N/A for same-origin/self-hosted and a bundler's own
  content-hashed chunks.
- **SEC-CLIENT5. CSP present but ineffective - `unsafe-inline`/`unsafe-eval`/`data:`/wildcard in `script-src`**
  (CWE-693, ASVS 3.4.3). SEC-SUP9 flags an ABSENT CSP; this flags a present-but-bypassable one. Probe: read the
  actual policy and inspect `script-src` (and `default-src` backing it) for `'unsafe-inline'` (re-enables inline
  scripts - the thing CSP exists to stop), `'unsafe-eval'`, `data:`, a bare `*`/over-broad host, and whether
  `object-src 'none'` + `base-uri 'none'` are set. Correct: nonce/hash + `'strict-dynamic'`, `object-src 'none'`,
  `base-uri 'none'`, no `unsafe-inline`/`unsafe-eval`. Floor: effective `script-src` with `'unsafe-inline'`/
  `'unsafe-eval'` = **Medium** (defense-in-depth; **High** on the admin/payment plane where an XSS is Critical);
  wildcard host = Medium. FP-trap: `'unsafe-inline'` in `style-src` only is far lower risk; `'unsafe-inline'`
  PAIRED with a nonce/hash and `'strict-dynamic'` is the INTENDED backward-compat pattern (old browsers honor
  unsafe-inline, modern ones ignore it for strict-dynamic) - NOT a finding; a framework injecting nonces is
  correct; do not report a missing `X-XSS-Protection`.
- **SEC-CLIENT6. DOM clobbering; WebSocket with no Origin check / no per-connection auth** (CWE-79/346, ASVS
  3.2.3/4.4.x). Probe: (a) DOM clobbering - named-property access on `document`/`window` used as a VALUE on a
  page rendering user HTML that keeps `id`/`name` (a sanitizer configured to allow them, a CMS/MDX path); an
  injected `<img name="config">` clobbers `window.config`. (b) WebSocket - `new WebSocket(`/`socket.io`/`ws`/
  `EventSource`: is it `wss://`? does the server validate the handshake `Origin` (CSWSH - the WS handshake is
  protected by neither CORS nor SameSite, so any origin can open an authed socket on the ambient cookie)? is
  auth/tenant re-checked per message (SEC-API5)? Correct: DOMPurify `SANITIZE_NAMED_PROPS`, no globals on
  `document`, `Object.freeze` sensitive config; `wss` + Origin allowlist + a dedicated auth token + per-message
  authz. Floor: DOM clobbering reaching a script/URL/auth decision = **High**, else Medium; CSWSH on an authed
  socket = **High**. FP-trap: DOM clobbering is N/A if no path renders user HTML with `id`/`name` allowed
  (pure-JSX, never `innerHTML` - confirm N/A); a same-origin WebSocket STILL needs the Origin check.

---

## SEC-API - API-protocol surface (OWASP API Security Top 10 2023; ASVS V4 API and Web Service)

The governing sentence: **an API is only as controlled as its LEAST-guarded shape.** This lens covers the
protocol-level surface beyond a single handler's logic - the query language's own DoS, forgotten versions/debug
routes, the vendor response you trusted, the flows an attacker automates. **Object- and function-level authz
(BOLA/BFLA) at a REST route OR a GraphQL resolver is the SAME check as SEC-AC1/SEC-AC2** - a resolver is just
another entrypoint in that lens's six-answer probe; audit it THERE, not here.

- **SEC-API1. GraphQL - introspection in prod, no depth/complexity/cost limit, batching/alias abuse** (API4-
  adjacent, CWE-770/400/200, ASVS 4.3.x). Probe: is there a GraphQL server (`graphql`/`Apollo`/`typeDefs`/
  `/graphql`)? If so: introspection off + GraphiQL off in prod; a depth/complexity/cost limit or persisted-query
  allowlist (else a recursive `a{b{a{b...}}}` is unauth DoS); pagination caps (else `first: 99999999` returns
  the collection); **batching/aliasing** - array-batched ops or an alias flood (`a1: login a2: login ...`) runs N
  operations in ONE HTTP request, sailing past a per-REQUEST rate limit and per-attempt lockout (the batching
  brute force); resolver ownership/tenant authz -> SEC-AC1/AC2. Correct: introspection/GraphiQL off in prod;
  depth + cost + pagination caps; batching disabled or rate-limited per-OPERATION on login/OTP/pay. Floor:
  unauth complexity/batching DoS = **High**; batching bypassing an auth throttle = **High**; introspection of a
  private schema = **Medium**. FP-trap: N/A if REST-only (record it); introspection ON is fine for a deliberately
  public/partner GraphQL API.
- **SEC-API2. Improper inventory - shadow / deprecated / debug / non-prod endpoints reachable** (API9:2023,
  CWE-489, ASVS 13.4.2). Probe: enumerate ALL routes, not just current ones - `/v1` alongside `/v2` (an old
  version missing a control the new one added), `/debug`/`/test`/`/internal`/`/__`, a GraphQL playground,
  health/metrics leaking build/version, `seed`/`fixture`/`dev-login`/`/api/dev*`. The classic API9: `/v1/users/
  {id}` still live and missing the tenant check `/v2` added. Cross-check every non-prod route is **404'd in
  production by an env block, not merely unlinked** - the strong pattern is the multi-block gate (route 404s AND
  boot-seed skipped AND layout `notFound()`s), because one block a sibling skips leaves it reachable. Floor: an
  old version missing a control the current one has = **High** (a live BOLA by another name); a debug/seed route
  in prod = **High** (**Critical** if it writes or mints auth); version disclosure only = Low. FP-trap: a
  documented supported old version WITH the same controls is fine; framework internals and a health check
  returning `ok` are not inventory leaks.
- **SEC-API3. Unsafe consumption of a third-party / vendor API - trusting the response** (API10:2023, CWE-20,
  ASVS 2.2.2). Probe: for every outbound vendor call (`fetch`/`axios` + the SDKs), is the RESPONSE Zod-validated
  before use, or is `resp.json()` trusted and spread into a DB write / a Mongo filter / rendered HTML? Does the
  client auto-follow vendor redirects (an SSRF pivot - SEC-WEB2)? **The subtle one: a signature-verified webhook
  body STILL needs Zod** - the signature proves origin, not well-formed expected data; a compromised/buggy
  vendor or a replayed old-schema event still reaches your filter. Correct: Zod every third-party ingress
  (webhook bodies incl. signature-verified, API responses, redirect targets); don't follow vendor 3xx to
  untrusted hosts; treat a vendor response with the suspicion of a raw request body. Floor: unvalidated vendor
  field reaching a filter/DB write = **High** (SEC-INJ1 by another door); reaching HTML/exec = **Critical**;
  redirect-following SSRF = **High**. FP-trap: a scalar you immediately narrow (`Number(resp.balance)`) is fine;
  a typed vendor SDK needs no re-Zod for shape - but any value reaching a FILTER/sink is still narrowed.
- **SEC-API4. Sensitive business-flow anti-automation - no per-flow throttle beyond the edge** (API6:2023,
  CWE-799/770, ASVS 2.4.x). Couple to SEC-BL4. Probe: enumerate flows worth automating - signup, booking, review,
  OTP/SMS send, password reset, contact form - and ask what stops a script running each 10k times. An edge
  rate-limit is per-IP and rotatable; the check is a per-ACCOUNT/per-phone/per-flow limit IN THE APP, plus (for a
  costed flow) the fail-closed meter from SEC-BL4. Signature: a booking/review/signup path with NO server-side
  throttle beyond the edge; an OTP-send whose cooldown lives on a destroyable record (a verify/remove deletes it)
  or none. Correct: a per-identity/per-resource throttle keyed on something the caller can't destroy (HMAC of
  phone/email, not the user row); costed flows fail closed; optional human-timing/CAPTCHA on abuse-prone flows.
  Floor: automatable flow with a real cost (SMS/booking spam) = **High**; automatable but cost-free = **Medium**.
  FP-trap: an edge rate-limit DOES count as one layer - the finding is the ABSENCE of an app-layer per-identity
  limit on a sensitive/costed flow; a read-only idempotent uncosted GET needs none.
- **SEC-API5. Realtime channels (WebSocket / SSE / gRPC) - auth at handshake AND per message, Origin check**
  (CWE-306/346, ASVS 4.4.x). Probe: for every WS/SSE/gRPC-stream surface (`WebSocket`/`socket.io`/`ws`/
  `EventSource`/`text/event-stream`/`@grpc`): (1) identity established at the handshake from a real session/
  token, not open to anyone who connects; (2) handshake `Origin` allowlisted (CSWSH - shared with SEC-CLIENT6,
  one finding); (3) EACH message/subscription re-authorized against the connection's TRUSTED identity/tenant, not
  a tenant id in the payload - a long-lived socket is a PERSISTENT BOLA the moment per-message authz is skipped;
  (4) SSE/gRPC-web ride HTTP so Origin/CSRF apply; gRPC needs per-RPC auth metadata, not just channel TLS.
  Correct: authenticate the handshake, Origin allowlist, re-derive tenant from the connection principal per
  message, `wss`/TLS. Floor: missing per-message tenant authz on an authed socket = **Critical** (cross-tenant
  on a persistent channel); missing handshake auth = **Critical**; missing Origin check (CSWSH) = **High**.
  FP-trap: N/A where the app HOSTS no realtime channels (a vendor webhook POST is request/response HTTP, not a
  socket you serve - record N/A); a broadcast-only SSE of PUBLIC data needs no per-message authz.

---

## SEC-SEC - Secrets, crypto, data protection (what gitleaks' regex cannot see)

gitleaks matches contiguous high-entropy strings; this lens finds what regex can't - semantic and dataflow
failures. Severity floor escalates if the secret guards money, cross-tenant PII, or the auth plane.

- **SEC-SEC1. Fast hash as a KDF / unpeppered code hash** (CWE-916). A fine primitive (`sha256`) on a
  low-entropy human secret (password, 6-digit code). Probe: `createHash(`/`hashlib` -> trace the input. Correct:
  passwords through argon2id/bcrypt/scrypt/PBKDF2 at current work factors; low-entropy codes HMAC-peppered with
  a server secret. Violation: `createHash("sha256").update(password)`; a bare `sha256(sixDigits)`. Floor:
  **High** (Critical on the password path).
- **SEC-SEC2. `Math.random()` for anything unguessable** (CWE-330/338). Probe: `Math.random(`/`Date.now()+` ->
  is the value a token/id/OTP/nonce/salt/reset-link? Correct: `crypto.randomBytes`/`randomUUID`/
  `getRandomValues`, >=128 bits. Floor: **High** (Critical for a session/reset token or a minted signed token).
- **SEC-SEC3. ECB mode / static or reused IV-nonce** (CWE-327/329). Probe: `aes-\d+-ecb`/`"ECB"`/`createCipher\b`
  (derives key+IV from a password, no salt); read the IV arg of `createCipheriv` - constant, zero-buffer,
  hash-of-plaintext, or reused. **Resolve the IV's LIFETIME, not just its declaration:** a `randomBytes(16)` IV
  hoisted to module/singleton scope is REUSED across every encryption even though it *is* `randomBytes` - it
  looks random to "read the IV arg" but detecting reuse needs lifetime analysis. Assert one fresh IV minted at
  the call site per encryption. Correct: AES-GCM with a fresh CSPRNG IV per encryption. Floor: **High**;
  **GCM/CTR nonce reuse = Critical** (it leaks the authentication key and enables forgery).
- **SEC-SEC4. JWT decode-not-verify / `alg:none` / no pinned algorithm** (CWE-347). Probe: `jwt.decode(`/
  `decodeJwt(` reading claims WITHOUT a signature check that drive an authz/tenant decision; a `verify` call
  with NO `algorithms:` option (honors an attacker-chosen `alg`, incl. `none`, or RS256->HS256 confusion).
  Correct: `jwt.verify(token, key, { algorithms: ['HS256'] })`. Floor: **Critical** (auth bypass). Apply to any
  home-grown signed token (a parameter-token) too: verify-before-trust, pinned MAC, expiry, no secret in payload.
- **SEC-SEC5. Secret the regex misses - built by concatenation or from a non-obvious source** (CWE-798). Probe:
  backticks/`+` around `password`/`secret`/`Bearer `/`Basic `/`mongodb`; a hardcoded fallback
  `process.env.KEY ?? "dev-secret"` (the fallback is the leaked secret, invisible to entropy scanners); a
  `-----BEGIN` private key inline; a real value in `.env.example`. Correct: every piece from validated env, and
  every secret var registered in the project's secret-keys list so the log redactor masks it. Floor: **High**
  (Critical for a live private key in VCS).
- **SEC-SEC6. Sensitive data in logs / errors / client bundle** (CWE-532, CWE-209). Probe: inspect the OBJECT
  being logged, not the message (`log.debug({ req })` serializes an `Authorization` header); `catch` blocks
  returning `err.message`/`err.stack` across a trust boundary; in Next.js, a non-`NEXT_PUBLIC` `process.env`
  read in a `"use client"` file or a server secret passed as a prop into a client component (bundled into the
  HTML/JS). Correct: log with secrets omitted; boundary returns a generic message, detail to logs only;
  secret-touching modules open with `import "server-only"`. Floor: secret in client bundle/logs = **Critical**;
  tenant PII in an error/log = **High**.
- **SEC-SEC7. Timing-unsafe secret comparison** (CWE-208). Probe: `===`/`.equals(`/`==` in the same function as
  `token`/`sig`/`hmac`/`secret`/`otp`/`apiKey`. Priority sites: webhook signature checks, a minted-token
  verify, a trusted-device cookie HMAC, the OTP compare, an edge secret. Correct:
  `crypto.timingSafeEqual(...)`, or the vendor SDK's own constant-time verifier
  (`stripe.webhooks.constructEvent`). Floor: **Medium** (High when it guards webhook authenticity, the edge
  secret, or the trusted-device cookie).
- **SEC-SEC8. Plaintext transport / disabled cert validation** (CWE-319). Probe: `http://` (non-localhost) to a
  vendor/DB; `rejectUnauthorized: false`/`NODE_TLS_REJECT_UNAUTHORIZED=0`; a bare `mongodb://` to a public
  host. Correct: HTTPS with cert validation to every subprocessor. Floor: **High**.

---

## SEC-BL - Business logic and concurrency (the highest-value findings a scanner NEVER produces)

The method, applied to every state-changing op: reconstruct the two-site trace - the CHECK site (the `if`, the
`find`, the balance read) and the ACT site (the write/charge/send) - then ask: is the window closed (check and
act one atomic op)? is the act deduped? can it be reached out of order or by a client-asserted value?
**Name the invariant, then find its single atomic enforcer.** If you cannot point to ONE line that enforces
"coupon used once" / "balance never negative" / "event processed once", it is unenforced regardless of
surrounding validation.

- **SEC-BL1. TOCTOU / race** (CWE-367/362). Probe: a read (`findOne`/count/balance) followed by a dependent
  write (`updateOne`/`$set`/`save`) with an `await` between; `$set` from a stale read is the signature.
  Correct: one atomic op - a conditional update `updateOne({_id, remaining: {$gte: n}}, {$inc: {remaining:
  -n}})` with modified-count checked, or `findOneAndUpdate`/`findOneAndDelete`, or `SELECT ... FOR UPDATE`, or a
  transaction. Floor: **High**; **Critical** when the raced resource is money, paid quota, or a security counter
  (lockout/2FA guesses).
- **SEC-BL2. Idempotency / at-least-once** (webhooks, retries). Probe: for every inbound webhook, does it go
  from signature-verify straight to the side effect, or does it claim the external event id via insert-or-ignore
  on a UNIQUE index BEFORE acting? A `findOne({eventId})` then `if(!exists)` is itself a TOCTOU, not a claim.
  For outbound retried operations, is an idempotency key passed (or, for a vendor with none, is retry avoided -
  a retry is a second real charge)? Duplicate should return 2xx (a non-2xx schedules more retries). Correct:
  atomic id claim then act; side effects idempotent (upsert to an absolute state). Floor: **High** for any
  billable/customer-visible effect; **Critical** on money.
- **SEC-BL3. Money correctness** (unit/float/atomicity). Probe: money typed as `number`/`float`, or `*`/`+`/`/`
  on an amount that isn't the money type; a percent crossing as `0.2` on one path and `20` on another; a
  minor-unit integer treated as major units; a multi-doc transfer not in one transaction; a refund with no `<=
  captured` guard or no dedupe. Correct: integer minor units or the project's decimal type end to end; single
  rounding step, explicit mode; atomic multi-doc writes. Floor: **High** (wrong amount charged/refunded);
  Medium if float money is only displayed, never summed/charged.
- **SEC-BL4. Cost-DoS / unbounded paid fan-out** (API4:2023). Probe: enumerate every paid-vendor call
  (LLM/SMS/telephony/geocode/email); walk OUTWARD to the entrypoint and ask - who reaches it unauthenticated,
  and what bounds the calls per caller? A per-operation limit, not just an edge rate limit. Does the meter fail
  CLOSED (degrade to a floor on an unknown plan, never swallow an error into "allow")? Any retry loop on a
  non-idempotent paid send? Correct: paid path behind auth or a minted single-use token; per-caller limit in
  addition to the edge; meter checked before the spend, fails closed; refund quota only for provably-unsent.
  Floor: **High**; **Critical** if unauthenticated.
- **SEC-BL5. Broken state machine** (CWE-841). Probe: find each status field, draw its intended graph, grep
  every write that sets it - does it guard on the current state or set unconditionally? An unconditional
  `{$set:{status:'cancelled'}}` on a doc already `completed` re-enters a terminal. Watch two nullable
  timestamps that should be mutually exclusive (`cancelledAt` AND `completedAt`). Correct: one enum; every
  transition a conditional `updateOne` filtering on the allowed prior state, modified-count checked; terminal
  states have no outgoing transition. Floor: **Medium**; **High** when re-entry causes a money/security effect
  or a double external side effect.
- **SEC-BL6. Workflow bypass** (CWE-841). Probe: for each multi-step flow (sign-up->verify->act;
  book->pay->fulfil; password->OTP->session), does the terminal step re-derive that the prerequisite completed
  from server-side state, or trust a client flag/param? The tell is a guard on the UI path but absent on a
  sibling entry (a server action, a webhook, a direct route) reaching the same effect. Never accept from the
  client: prices, discounts, user/tenant/role ids. Correct: terminal step reads server-side workflow state,
  checked at EVERY handler (a shared chokepoint), all security-relevant values re-derived server-side. Floor:
  **High**; **Critical** if it crosses a tenant boundary or the auth plane.
- **SEC-BL7. Unbounded resource consumption (non-paid)** (CWE-400/770/1333/409). SEC-BL4 covers PAID fan-out;
  this covers compute/memory exhaustion. Probe: a client-controlled `limit`/page size with no ceiling (fetch-all
  DoS + memory blowup); no request-body/upload size cap; **ReDoS** - a user string tested against a regex with
  catastrophic backtracking (grep `new RegExp(userInput)` and nested-quantifier literals `(a+)+`/`(.*)*` fed
  unbounded input); a **decompression bomb** on any archive/gzip extraction (CWE-409). Correct: hard caps on
  pagination/body/upload size; a bounded or timeout-guarded regex, or `RE2` for user-supplied patterns; entry-
  count + total-size limits on decompression. Floor: **Medium**; **High** if one request exhausts memory/CPU for
  all tenants. FP-trap: a constant/developer-authored regex is not ReDoS - the input to the regex must be
  attacker-controlled; a paginated endpoint with a hard max is fine.

---

## SEC-AI - AI / LLM attack surface (a differentiator; the reviewed project is often itself an LLM app)

Maps to OWASP Top 10 for LLM Apps 2025 + Agentic AI. **Start by drawing the lethal trifecta for each model
context: (1) access to private data, (2) exposure to untrusted content, (3) ability to communicate externally.
Any unsupervised agent with all three is exfiltration-ready by construction (Meta's "Rule of Two": at most two
of the three without a human gate). All-three-without-a-gate is a Critical before you read a line of prompt.**
Two boundaries drive everything: **Boundary A** (data -> prompt: where a string becomes model input) and
**Boundary B** (model output -> a tool call / SQL / HTML / shell / another prompt). **Severity is always set at
Boundary B - what the tainted context can DO - never at the prompt text.**

- **SEC-AI1. Prompt injection, direct and indirect** (LLM01:2025). Probe: enumerate Boundary A (grep
  `messages`/`chat.completions`/`responses.create`/`generateText`/`system:`/`systemPrompt` and the string
  interpolated into them). Classify each interpolated var trusted/untrusted - untrusted = request bodies,
  DB fields other users wrote (names/notes/transcripts), fetched web pages, RAG retrievals, AND every tool
  result fed back into the loop. Then trace to Boundary B (the tool list). Correct: the architecture makes it
  impossible for ingested untrusted input to trigger a consequential action - action-selector /
  plan-then-execute / dual-LLM / context-minimization pattern, plus a human gate or deterministic authz on
  consequential actions. Violation: untrusted content in the same channel as instructions feeding a
  tool-capable model. Floor: indirect injection into a context that can reach a state-changing/cross-tenant/
  external tool = **Critical**; direct injection with NO tools (pure text) = **Medium**.
- **SEC-AI2. Insecure output handling - the model IS the injection source** (LLM05:2025). Probe: every Boundary
  B where model output reaches a sink (`execute(`/`query(`/`os.system`/`eval(`/`innerHTML`/`fetch(`/a Mongo
  pipeline). Structured output constrains SHAPE not CONTENT - a validated JSON string field can still carry
  `'; DROP` or `<script>`. Correct: treat model output with the exact suspicion of a raw request body -
  parameterize/escape/`$literal`/allowlist at the sink. Floor: output -> SQL/shell/eval/pipeline-expression =
  **Critical**; -> HTML = **High**; -> path/URL = **High**.
- **SEC-AI3. Excessive agency / tool abuse** (LLM06:2025). Probe: build the tool inventory (grep
  `tools:`/`registerTool`/`defineTool`/`@tool`/`mcp`). Per tool: excessive functionality (more ops than the
  task needs)? excessive permissions (the tool's own credential broader than needed; runs as the operator not
  the end-user)? excessive autonomy (irreversible/costly action with no human gate)? **The critical check:
  per-tool authz re-checked inside the handler against a TRUSTED identity - a tool taking `<tenantKey>` as a
  model-provided argument is a cross-tenant hole, because the model's context is caller-controlled.** Correct:
  narrow purpose-built tools; each handler re-derives identity/tenant from session or a signed token and
  re-checks ownership; state-changing tools behind a human gate or a deterministic rule; a step/recursion
  budget. Floor: state-changing tool reachable from an attacker-influenced context with no gate, or missing
  per-tool tenant authz = **Critical**; over-scoped credential with no reachable exploit = **High**.
- **SEC-AI4. System-prompt secrets / instruction leakage** (LLM07/LLM02). Probe: grep prompt-construction sites
  and prompt templates for embedded secrets/creds/tenant data; and check that authz/safety limits live in CODE,
  not in a prompt sentence ("only access the current user's data" as the sole control is a leakable, injectable
  non-control). Floor: a live secret or another tenant's PII in a prompt = **Critical**; instruction leakage
  where the prompt WAS the only access control = **High**; leakage of guardrails with real controls in code =
  Low-Medium.
- **SEC-AI5. RAG / memory poisoning + retrieval ACL + denial-of-wallet** (LLM04/08/10). Probe: the WRITE path
  into the vector store/memory (`upsert`/`addDocuments`/`embed`) - who can write, is it trusted? The READ path
  (`similaritySearch`/`retrieve`) - is a tenant/ACL filter applied server-side at query time on a trusted
  identity? And a cap on every costed sink and the agent loop (token cap, rate limit, per-tenant budget, a
  bounded step counter - an unbounded `while` on tool-calls with a real per-action cost is denial-of-wallet).
  Floor: missing retrieval ACL (cross-tenant data) = **Critical**; unvalidated ingestion into a tool-capable
  context = **High**; no cap on a costed sink/loop = **High**.

---

## SEC-SUP - Supply chain, CI/CD, config (the manual layer beyond osv-scanner/trivy)

Maps to A02:2025 Security Misconfiguration and A03:2025 Software Supply Chain Failures. Note: if the project
has no CI (`.github/workflows/` absent), the CI checks yield nothing today but arm the moment CI is added -
record that, don't skip silently.

- **SEC-SUP1. Poisoned pipeline execution - `pull_request_target`/`workflow_run` + untrusted checkout/exec.**
  Probe: `grep -rn "pull_request_target\|workflow_run" .github/workflows/`, then whether a step checks out
  `github.event.pull_request.head.{sha,ref}` and runs anything on it (`npm ci`/build/test = attacker code with
  the base repo's secrets). Correct: plain `pull_request` for anything running untrusted code; reserve
  `pull_request_target` for trusted-metadata-only jobs. An explicit `allow-unsafe-pr-checkout: true` is itself
  a red flag. Floor: **Critical** (RCE on runner with secrets + write token from an anonymous fork PR).
- **SEC-SUP2. Script injection - `${{ github.event.* }}` into a `run:` step.** Probe: `grep -rn "run:"
  .github/workflows/ | grep -E '\$\{\{[^}]*github\.(event|head_ref)'` - PR/issue title/body, commit message,
  branch name are attacker-controlled and substituted into the shell before it runs. Correct: pass through an
  intermediate quoted `env:` var so it never reaches the shell parser. Floor: **High** (Critical with secrets).
- **SEC-SUP3. Unpinned actions.** Probe: `grep -rnE "uses:\s*[^@]+@(v?[0-9.]+|main|master|latest)\b"` - a
  mutable tag can be repointed to malicious code retroactively (CVE-2025-30066, tj-actions). Correct: pin to a
  40-char commit SHA with the version in a comment. Floor: third-party action = **High**; GitHub-owned/verified
  = **Low/Medium** (don't inflate every `actions/checkout@v4` to critical).
- **SEC-SUP4. Over-broad `GITHUB_TOKEN` permissions.** Probe: no top-level `permissions:` block (inherits a
  broad default); `write-all`; `contents: write` on a build/test job. Floor: **Medium** (High/Critical combined
  with SUP1/SUP2 - a write token in a workflow running untrusted code = repo takeover).
- **SEC-SUP5. Secrets to logs / fork PRs.** Probe: `echo`/`printenv`/`env`/`set -x` near a secret; secrets in a
  `pull_request_target`/`workflow_run` job touching fork input. Floor: **High** (and rotate any leaked secret).
- **SEC-SUP6. Self-hosted runner on a public repo.** Probe: `runs-on:` not a GitHub-hosted label; is the repo
  public and does a `pull_request` reach it? Non-ephemeral runners retain state. Floor: **High**.
- **SEC-SUP7. Dockerfile.** Probe: secrets in `ARG`/`ENV`/build layers (recoverable via `docker history`);
  no `USER` (runs as root); `FROM ...:latest`; `curl | sh` / `ADD https://`. Correct: BuildKit secret mounts or
  runtime env; non-root `USER` before `CMD` (confirm the FINAL stage - distroless is already nonroot);
  digest-pinned base; `COPY` a checksum-verified artifact. Floors: secrets-in-layers = **High**; root =
  **Medium** (High if internet-facing); `latest` = **Low** (hygiene, not a vuln); `curl|sh` = **Medium**.
- **SEC-SUP8. IaC / cloud config.** Probe: `0.0.0.0/0` on ingress (grade by PORT - 22/3389/DB = Critical, 443
  on a public LB = expected); public storage buckets (`acl = "public-read"`, missing block-public-access -
  Critical if PII); IAM `Action:"*"`/`Resource:"*"`/wildcard principal (grade by the action's power -
  `Describe*`/`List*` often need `*`; `s3:*`/`iam:*` on `*` = High); debug mode in prod (`debug=true`,
  `NODE_ENV=development` - High if it exposes an interactive console); default/hardcoded creds = **Critical**.
- **SEC-SUP9. Framework misconfig (checkable from code).** Probe: auth/session cookies without
  `HttpOnly`/`Secure`/`SameSite` (Floor Medium, High for the session token); permissive CORS + credentials
  (SEC-WEB6); CSRF absent on cookie-authed mutations (Floor High - but Bearer-token routes and
  signature-verified webhooks are NOT CSRF-able, and Next.js Server Actions already enforce a same-origin
  check); missing security headers - a missing **CSP** is the one that matters (Low/Medium).
  **Noise-control, do NOT report:** a missing `X-XSS-Protection` (deprecated, removed from browsers); a missing
  `X-Frame-Options` when a CSP `frame-ancestors` is present (obsoleted); `ACAO: *` on a public,
  credential-less, read-only endpoint (by design); a header absent at the origin but injected by the
  edge/CDN (trace the response through the edge first).
- **SEC-SUP7/SUP8 escalation:** if `Dockerfile` / IaC (`*.tf`, CloudFormation, Pulumi) / Kubernetes-manifest
  markers are present, these two checks are only the TRIPWIRE - escalate into the SEC-CLOUD family
  (`reference/cloud-lenses.md`) for the cross-resource, absence, and code-only depth (RBAC subject-reachability,
  missing NetworkPolicy/PSA label/CloudTrail, Lambda event-source injection). SUP7/SUP8 are the surface;
  SEC-CLOUD is the depth. No committed infra artifact = SEC-CLOUD is N/A, not clean.

---

## SEC-LOG - Security logging, monitoring, alerting (OWASP A09:2025 Security Logging and Alerting Failures)

Renamed to "Alerting" for 2025 to stress that logging without alerting is near-worthless. The inverse of SEC-SEC6
(which keeps secrets OUT of logs); this checks that a security audit trail EXISTS and is sufficient - and it is
the code-verifiable half of the SOC 2 / GDPR-Art-33 "one audit trail" obligation.

- **SEC-LOG1. Security-relevant events not recorded** (CWE-778, A09). Probe: for each of auth events (sign-in/
  out, failure), access-control failures, admin actions, staff-access-to-tenant-PII, privilege/role changes, and
  data exports, grep for an append to the audit trail carrying who/what/when/from-where. The strongest form: is
  there ONE audit chokepoint that every security-relevant action routes through, or do features invent per-
  feature logs (or none)? A staff member reading cross-tenant PII with no access row is the finding. Correct: a
  single audit sink, every such event recorded with actor+action+time+source-IP (the IP from `<trustedIpResolver>`).
  Floor: **Medium**; **High** for unlogged staff/admin access to tenant PII or a role change (a SOC 2 evidence
  gap). FP-trap: high-volume non-security telemetry (request logs) is NOT the audit trail - its absence is not
  this finding; and retention/tamper-evidence of the trail is a FLAGGED item (needs prod/infra), not a code
  finding - state it, don't false-pass it.
- **SEC-LOG2. Log injection / forging - unsanitized newlines or control chars in logged user input** (CWE-117).
  Probe: grep log calls that interpolate raw user input into a string (`log.info(\`user ${name}\`)`) - a name
  containing `\n` forges a fake log line, poisoning the very audit trail an investigator relies on. Correct:
  structured logging with fields (a context OBJECT, not an interpolated string) - JSON-encoded values cannot
  inject line structure. Floor: **Medium** (High when it corrupts the security audit trail). FP-trap: structured/
  object logging where the value is a JSON field is already safe - flag only string-concatenated log lines
  carrying untrusted input.
- **SEC-LOG3. Detection without response - a security failure logged but nothing alerts, or only at `debug` on an
  ephemeral FS** (A09, CWE-390). Probe: for security failures (repeated auth failure, meter-fail-closed, webhook
  signature mismatch, staff access), is the signal emitted ABOVE `debug` and routed somewhere durable/alertable,
  or swallowed into a debug file production discards (e.g. `DEBUG_LOG_FILE=` empty in prod)? Floor: **Low/Medium**
  - this is design-level; report as an A09 observation, not always a code bug. FP-trap: you often cannot prove
  alerting from code - record it as an informational/FLAGGED gap rather than inflating severity.

---

## SEC-ERR - Mishandling of exceptional conditions (OWASP A10:2025, the new-for-2025 category)

Generalizes the single fail-closed insight the catalog already has in SEC-BL4 to every control. What happens
when things go wrong is a security decision.

- **SEC-ERR1. Fail-OPEN security decision - a `catch`/error path that defaults to allow** (CWE-636/703). Probe:
  grep `try/catch` (and `.catch()`) wrapping an authz check, a token verify, a tenant lookup, a lockout read, a
  signature check; does the error branch DENY, or fall through to the allowed path? A `catch` that logs and
  continues past an authorization check is auth bypass on error. Correct: deny / fail-closed on any exception in
  a security decision. Violation: `try { assertAuthorized() } catch { /* proceed */ }`; a meter whose unknown-
  plan path throws into a catch that returns UNMETERED. Floor: **High**; **Critical** when the failing control is
  authz, tenancy, or the spend meter.
- **SEC-ERR2. Swallowed failure - an empty catch, or a redirect/poll that hides a failed security-relevant
  operation** (CWE-390/1069). Probe: grep empty/comment-only catch blocks and catches that only `log.debug`;
  then the harder case - a failure hidden by a redirect, popup, or poll so the user and the operator never see
  it. Correct: every failure surfaces (to the user with a next step, to the audit trail for security events); no
  silent swallow. Floor: **Medium**; **High** when the swallowed op was a payment, a booking, or a security
  check. FP-trap: a deliberately non-throwing function that returns a typed result (a resolver that never throws
  by design) is intentional - the finding is a SWALLOWED error, not a by-design graceful degrade.
- **SEC-ERR3. Partial-failure / inconsistent state - a multi-step side effect where a mid-step throw leaves step
  1 applied** (CWE-460/755). Probe: multi-doc writes or external side effects (charge + book, send + meter) not
  wrapped in a transaction or a compensating action - step 2 throws, step 1 stands. Couple to SEC-BL3 (atomic
  money) and SEC-BL2 (idempotency). Correct: `withTransaction` for all-or-nothing DB writes; a compensating
  rollback or idempotent replay for external effects. Floor: **High** on money/booking state.
- **SEC-ERR4. Unhandled-rejection / exception DoS - an input that crashes the process or wedges a route**
  (CWE-248, A10). Probe: an uncaught async rejection that takes down the Node process (all tenants), a per-
  request throw with no boundary that 500s a shared handler, or recursive retry with no ceiling. Correct: a
  top-level per-request error boundary; a process-level `unhandledRejection` handler that logs and stays up.
  Floor: **Medium**; **High** if one crafted request downs the shared runtime.

---

Every finding this catalog produces still has to clear Phase 40's evidence bar (concrete source->sink trace at
real `file:line`, the missing control named, a reproducible trigger->outcome) and Phase 50's triage before it
reaches the report. A lens hit is a candidate, never a finding.

Two whole OWASP-2025 categories have no dedicated family because they are cross-cutting, not a probe: **A06
Insecure Design** surfaces through SEC-BL (missing-by-design rate limits, trust-boundary segmentation) and
SEC-AC - when you find one, tag it `A06` rather than inventing a lens; **A08 Software and Data Integrity
Failures** surfaces through SEC-SUP (unpinned/unsigned components), SEC-CLIENT4 (missing SRI), and SEC-INJ6
(unsafe deserialization of cookie/cache data) - tag it `A08`.
