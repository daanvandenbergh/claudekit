// audit-security self-test fixture (FAIL-OPEN-08). INERT: never imported, never executed.
// The authorization check fails OPEN: any error in the ownership lookup lands in a catch that
// returns true (allow). An exception (DB blip, malformed id) becomes an authorization bypass.
declare const db: { ownerOf(recordId: string): Promise<string> };

export async function assertAuthorized(principal: string, recordId: string): Promise<boolean> {
    try {
        const owner = await db.ownerOf(recordId);
        return owner === principal;
    } catch {
        // sink: fail-OPEN - the error path defaults to allow instead of deny.
        return true;
    }
}
