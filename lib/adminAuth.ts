const ID_KEY = "hh_admin_id";
const SECRET_KEY = "hh_admin_secret";

export interface AdminCreds {
    id: string;
    secret: string;
}

export function getAdminCreds(): AdminCreds | null {
    if (typeof window === "undefined") return null;
    const id = window.sessionStorage.getItem(ID_KEY);
    const secret = window.sessionStorage.getItem(SECRET_KEY);
    if (!id || !secret) return null;
    return { id, secret };
}

export function setAdminCreds(creds: AdminCreds): void {
    window.sessionStorage.setItem(ID_KEY, creds.id);
    window.sessionStorage.setItem(SECRET_KEY, creds.secret);
}

export function clearAdminCreds(): void {
    window.sessionStorage.removeItem(ID_KEY);
    window.sessionStorage.removeItem(SECRET_KEY);
}