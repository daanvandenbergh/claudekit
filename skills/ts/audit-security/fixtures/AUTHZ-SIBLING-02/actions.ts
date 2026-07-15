// audit-security self-test fixture (AUTHZ-SIBLING-02). INERT: never imported, never executed.
// Two sibling server actions. inviteAction gates; setRoleAction (the more dangerous one) does not.
"use server";
declare function requireStaff(): Promise<void>;
declare const db: { setRole(u: string, r: string): Promise<void>; addInvite(e: string): Promise<void> };

// trap (must NOT be flagged): correctly gated.
export async function inviteAction(email: string): Promise<void> {
    await requireStaff();
    await db.addInvite(email);
}

// sink: privilege-granting action reachable with NO staff gate - the sibling gates, this one forgot.
export async function setRoleAction(userId: string, role: string): Promise<void> {
    await db.setRole(userId, role);
}
