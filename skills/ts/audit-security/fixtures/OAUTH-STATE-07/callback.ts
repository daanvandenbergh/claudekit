// audit-security self-test fixture (OAUTH-STATE-07). INERT: never imported, never executed.
// The OAuth callback reads `code` and mints a session, but never generates or validates a `state`
// parameter - login CSRF / authorization-code injection. The bug is a MISSING protocol check.
declare const provider: { exchange(code: string): Promise<{ sub: string }> };
declare const session: { mint(sub: string): Promise<string> };

export async function oauthCallback(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const code = url.searchParams.get("code") ?? "";
    // sink: no `state` read, no compare against a stored value -> the callback is not bound to the
    // session that started the flow. An attacker can inject their own code.
    const { sub } = await provider.exchange(code);
    const token = await session.mint(sub);
    return Response.json({ token });
}
