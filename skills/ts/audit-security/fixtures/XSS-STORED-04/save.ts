// audit-security self-test fixture (XSS-STORED-04). INERT: never imported, never executed.
// Source half: a request-supplied note is persisted RAW (no sanitization). Rendered in render.tsx.
declare const db: { saveNote(id: string, note: string): Promise<void> };

export async function saveNote(req: Request): Promise<Response> {
    const body = (await req.json()) as { id: string; note: string };
    await db.saveNote(body.id, body.note); // source: raw request field persisted for later render.
    return Response.json({ ok: true });
}
