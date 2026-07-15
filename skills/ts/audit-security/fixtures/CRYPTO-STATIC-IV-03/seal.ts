// audit-security self-test fixture (CRYPTO-STATIC-IV-03). INERT: never imported, never executed.
// The IV looks random ("randomBytes") but is hoisted to module scope, so it is REUSED across every
// encrypt() call - detecting this needs lifetime analysis, not "is the IV arg random".
import { createCipheriv, randomBytes } from "node:crypto";

const KEY = randomBytes(32);
const SEAL_IV = randomBytes(12); // sink: one IV for the whole process lifetime - reused every call.

export function encrypt(plaintext: string): Buffer {
    const cipher = createCipheriv("aes-256-gcm", KEY, SEAL_IV);
    return Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
}
