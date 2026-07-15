# Supply-chain heuristics

The curated data the supply-chain greps in `phases/20-scanners.md` cannot carry inline: the
native-builder allowlist that makes the install-script sweep signal-bearing, and the severity /
noise-control matrix. Loaded by the SEC-SUP lens and Phase 20.

## The reachability reframe (read first)

**osv-scanner's call-analysis reachability is Go / Rust / Java ONLY - it does NOTHING for npm/JS.**
So for a Node project, dependency reachability is not a scanner flag, it is an **LLM lens or it does
not happen**: for each CVE, read the advisory's affected-symbol / "only when option X" text, then grep
the repo's import graph for whether that specific symbol is actually invoked on a path from an
entrypoint. Reachability is a **downgrade modifier only - never an upgrade, never an auto-suppress**
(a confirmed-reachable Critical stays Critical; an unreachable Critical drops at most two levels, never
below Info, and stays *listed* with a "not reached because..." note). JS dynamic `import()` / reflection
defeat static reachability, so an "unreachable" verdict is advisory context for the human, never an
auto-close.

## Expected-native-builder allowlist

The install-script sweep (`preinstall`/`install`/`postinstall`, excluding `prepare`/`prepublish` which
do not run on a published-tarball `npm ci`) flags packages that execute code at install time. Most hits
are legitimate native builds. This allowlist holds them at Info so the ONE real hit is not buried. A
package here with a *plain* build script is Info; a package here whose script does `child_process` +
network I/O, or is obfuscated, is still a finding (a compromised builder is the point).

Known-legitimate native/build packages (the model already knows the ecosystem - this is the fixed core,
extend at audit time): `esbuild`, `@esbuild/*`, `@swc/core`, `@swc/*`, `sharp`, `better-sqlite3`,
`node-gyp` and its consumers, `bcrypt`, `node-sass`/`sass`, `@parcel/*`, `puppeteer`/`playwright`
(download a browser), `cypress`, `electron`, `@prisma/engines`/`prisma`, `canvas`, `re2`, `sqlite3`,
`husky` (git hooks), `core-js` (deprecation notice postinstall - noisy but benign), `protobufjs`,
`@sentry/cli`, `keytak`/`keytar`.

**No offline typosquat name-DB is shipped** - the model knows the popular-package names, so name-
similarity (edit-distance-1/2 to a popular package) is an LLM judgment, not a lookup. A stale offline
list would be worse than the model's knowledge.

## Severity / noise-control matrix

| Signal | Floor | Noise-control |
|---|---|---|
| **Internal/scoped name resolvable from PUBLIC registry** (dependency confusion) | **Critical** | latent if no private scope exists yet -> Info + a `TODO.md` guard (`@scope:registry=`) |
| Foreign/unexpected registry in a lockfile `resolved` URL | **High** | one approved registry is the baseline; grep `resolved` hosts |
| **Failed registry SIGNATURE** (`npm audit signatures`) | **Critical** | a tampered/MITM'd tarball - the one hard gate |
| Missing provenance/SLSA attestation | **not a finding** | spotty across the long tail; presence is a plus, absence is Info |
| Unexpected `postinstall` in a transitive dep | **High** | allowlisted native builder -> Info |
| `postinstall` + `child_process` + network / obfuscation | **Critical** | live-malware shape - candidate for a human read, clears nothing on its own |
| Typosquat: direct dep one char off a popular name | **High** | investigate before anything else |
| Brand-new / 0.x / no `repository`/`homepage` dep | **Low-Medium** | offline proxies for "immature"; online `npm view time.created` sharpens |
| **AGPL** in a runtime dep (proprietary/hosted SaaS) | **High** | the network-use clause a hosted SaaS cannot dodge |
| GPL/LGPL in a runtime dep | **Medium** | flag for legal; non-distribution softens it |
| GPL in a dev-only / build-time tool | **Low** | never distributed, never linked |
| `UNKNOWN`/`UNLICENSED` runtime dep | **Medium** | an unquantified obligation |
| Permissive (MIT/ISC/BSD/Apache-2.0) | **Info** | - |
| **Any dependency CVE reachability** | downgrade-only | dev-only deps -2 before any reachability reasoning; never suppress, only list-with-note |
| Deprecated runtime transitive dep | **Low-Medium** | unmaintained -> future-CVE risk, no upstream fix |
| Outdated-but-no-CVE dep | **Info-Low** | latent, not a bug |
| Base-OS CVE (built image) | CVSS x exposure | **`--ignore-unfixed` mandatory** or it trains the reader to ignore trivy |

**dev-vs-prod is the first, free cut:** osv reads the lockfile dep-groups, so a `devDependencies`-only
CVE (test/build tooling that never reaches the Railway runtime) is downgraded two levels deterministically
before any reachability reasoning.

## Two standing TODO.md items this lens surfaces

1. Write the `@scope:registry=` `.npmrc` guard before any private scope is published (dependency-
   confusion pre-empt).
2. Close the base-OS scan gap when the deploy owns the base image (Nixpacks/dashboard build) - scan the
   built image (`trivy image --ignore-unfixed`) or adopt a pinned, scannable Dockerfile.
