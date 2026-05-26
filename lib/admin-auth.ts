import crypto from "crypto";

export const AUTH_COOKIE = "duo_admin_auth";

const ADMIN_USER = "admin";
const ADMIN_PASS = "duotech@";
const SALT = "duo-davas-2026-secret";

export function getAuthToken(): string {
  return crypto
    .createHash("sha256")
    .update(`${ADMIN_USER}:${ADMIN_PASS}:${SALT}`)
    .digest("hex");
}

export function checkCredentials(user: string, pass: string): boolean {
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

export function isAuthenticated(cookieValue: string | undefined): boolean {
  return cookieValue === getAuthToken();
}
