// audit-security self-test fixture (SECRET-HISTORY-06). INERT: never imported, never executed.
//
// This fixture tests the git-HISTORY secret scan (gitleaks git), which a working-tree-only scan
// misses. A fresh checkout carries no history, so the leak CANNOT ship in-tree - the HEAD version
// of this file holds only the placeholder below.
//
// HARNESS SETUP (documented, run by the maintainer to stage the canary - NEVER commit a real key):
//   1. git commit this file with a synthetic but live-FORMAT credential on the marked line, e.g.
//        export const DB_URL = "mongodb+srv://svc:AKIAIOSFODNN7EXAMPLE@cluster0.example.net/app";
//   2. git commit again, replacing it with the placeholder below (the leak is now history-only).
//   Result: `gitleaks git` finds it, `gitleaks dir` does not - exactly the seam the canary probes.

export const DB_URL = process.env.DB_URL ?? "mongodb://localhost:27017/app"; // placeholder - no secret
