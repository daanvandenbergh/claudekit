// audit-security self-test fixture (NOSQL-SMUGGLE-01). INERT: never imported, never executed.
// The bug spans two files: the source is here, the sink is customers.ts.
import { findByQuery } from "./customers.js";

export async function POST(req: Request): Promise<Response> {
    const body = (await req.json()) as { filter: Record<string, unknown> };
    // source: req.body.filter passed on with NO schema validation.
    const customer = await findByQuery(body.filter);
    return Response.json({ customer });
}
