// audit-security self-test fixture (XSS-STORED-04). INERT: never imported, never executed.
// Sink half: the stored note (written from a request in save.ts, cross-tenant/cross-session
// readable) is rendered via dangerouslySetInnerHTML - second-order stored XSS.
import * as React from "react";

export function NoteView({ note, title }: { note: string; title: string }): React.JSX.Element {
    return (
        <article>
            {/* trap (must NOT be flagged): plain JSX interpolation is auto-escaped. */}
            <h2>{title}</h2>
            {/* sink: persisted, request-written content rendered as raw HTML. */}
            <div dangerouslySetInnerHTML={{ __html: note }} />
        </article>
    );
}
