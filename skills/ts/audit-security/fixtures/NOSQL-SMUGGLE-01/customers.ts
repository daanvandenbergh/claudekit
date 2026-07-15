// audit-security self-test fixture (NOSQL-SMUGGLE-01). INERT: never imported, never executed.
// Sink half: findByQuery spreads an unvalidated caller object straight into a Mongo filter, so a
// body of { "id": { "$ne": null } } arrives as an OPERATOR, matching the first live doc.
declare const db: { collection(n: string): { findOne(f: unknown): Promise<unknown> } };

export async function findByQuery(filter: Record<string, unknown>): Promise<unknown> {
    // sink: operator smuggle - filter came from req.body with no primitive-narrowing.
    return db.collection("customer").findOne({ ...filter });
}

// trap (must NOT be flagged): orgId is a validated string, no object can slip in as an operator.
export async function findByOrg(orgId: string): Promise<unknown> {
    return db.collection("customer").findOne({ orgId });
}
