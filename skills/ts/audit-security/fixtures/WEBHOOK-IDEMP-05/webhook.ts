// audit-security self-test fixture (WEBHOOK-IDEMP-05). INERT: never imported, never executed.
// The bug is an ABSENCE: an at-least-once webhook applies its side effect with no dedup on the
// event id, so a redelivery double-charges. There is no dangerous token to pattern-match - only a
// missing insert-or-ignore on a unique key.
declare const stripe: { verify(sig: string, body: string): { id: string; amount: number; account: string } };
declare const db: { credit(account: string, amount: number): Promise<void> };

export async function handleWebhook(req: Request): Promise<Response> {
    const body = await req.text();
    const event = stripe.verify(req.headers.get("stripe-signature") ?? "", body);
    // sink: no `db.events.insertOne({_id: event.id})` insert-or-ignore before the side effect ->
    // a replayed delivery credits the account twice.
    await db.credit(event.account, event.amount);
    return Response.json({ received: true });
}
