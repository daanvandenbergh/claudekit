# Runbook: imprint / Impressum / legal notice

> Governs imprint runs. Generic to any project; all project facts come from Phase 2
> investigation and the project memory store. Small by design: everything substantive is in
> `references/imprint-requirements-eu.md` and every content field is ask-the-user.

## Purpose and applicability

Provider-identification duties (imprint/Impressum/mentions legales) attach country by
country - Germany (DDG s.5) and Austria (ECG s.5, MedienG s.25) are the strictest (in
Germany enforced above all via competitor cease-and-desist; in Austria via administrative
fines), so any business SERVING those markets should carry
the page even when established elsewhere (targeting analysis and the safe-harbor
recommendation: `references/imprint-requirements-eu.md` sections 5 and 2.5). Run the duty
test from the memory store's markets-served entry: serving DE/AT (language, currency, marketing,
customers there) -> the duty is presumed to bite; multiple-market service -> one
consolidated legal-notice page satisfying the strictest applicable regime.

## Mode detection specifics

Imprint page missing (search for imprint/impressum/legal-notice/mentions-legales routes) ->
CREATE: build it matching the project's other legal pages and add the persistent
footer/navigation link (reachability is itself a legal requirement). Present ->
VERIFY-AND-UPDATE: every required field present and current, link reachable from every page.

## Investigation focus

Phase 2 is light here (the content is not in code): confirm which legal pages/routes exist,
where the footer/navigation is defined, and what identity facts the memory store already holds.
The markets-served analysis (who is targeted) comes from the memory store plus marketing copy
found in the repo (languages offered, currencies, market claims).

## Drafting non-negotiables

- **Field set from the strictest applicable regime**, assembled per
  `references/imprint-requirements-eu.md`: the DDG s.5(1) verbatim-verified list (name and
  legal form, registered address - a P.O. box does not suffice, authorized representatives,
  contact incl. email and a second direct channel, register + registration number, VAT ID
  where issued, supervisory/licensing authority where the activity requires one, plus
  regulated-profession details where applicable). Austria adds MedienG s.25 disclosure;
  journalistic-editorial content adds an MStV s.18 responsible person (flag, ask).
- **Every field is ask-the-user** - none of this exists in a codebase; check the memory store's
  project profile first, ask for the rest, `[[PLACEHOLDER: ...]]` anything not yet supplied and
  list it as a publication blocker (an imprint with placeholders must NOT ship - unlike
  other policies, an incomplete imprint is itself the violation).
- **Placement**: persistent link from every page (footer norm), reachable within two clicks,
  labeled recognizably ("Imprint", "Impressum", "Legal notice"); per the reference's
  placement section.
- Keep identity facts consistent with the privacy policy, terms, and DPA signature blocks -
  one identity everywhere.
- **DSA contact/representative appointments stack with the Impressum** when the product is an
  in-scope intermediary serving the EU (`references/digital-services-act-eu.md`): the Art 11
  authority point of contact, the Art 12 user point of contact, and - for providers not
  established in the EU - the Art 13 legal representative. These are THREE distinct appointments
  from the Impressum and the GDPR Art 27 representative; name them separately, never conflate.

## Verification specifics (extends Phase 4)

- Field-completeness walk against the reference's required-fields list for each applicable
  regime; any missing field = FAIL.
- Link reachability from every layout (marketing AND app shells).
- Consistency of the identity block across all legal documents.

## Ask the user (never invent)

Everything: legal name and form, registered address, representatives, register + number,
VAT ID, supervisory authority, regulated-profession details, and (for AT/journalistic
content) the additional disclosure fields. Plus confirmation of which markets are targeted
if the memory store is ambiguous.
