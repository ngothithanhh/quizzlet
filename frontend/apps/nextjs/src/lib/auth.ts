/**
 * JWT auth utilities for Spring Boot backend integration.
 * Tokens are stored as cookies so they survive page refreshes.
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export interface JwtPayload {
  sub: string;      // email
  userId?: number;
  username?: string;
  iat?: number;
  exp?: number;
}

export interface UserInfo {
  email: string;
  username?: string;
  id?: string;
}

/** Decode a JWT without verifying the signature (client-side use only). */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

/** Check if a JWT is expired. */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now();
}

// ── Cookie helpers (client-side) ─────────────────────────────────────────────

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ── Token storage ─────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  setCookie(ACCESS_TOKEN_KEY, accessToken, 1);   // 1 day
  setCookie(REFRESH_TOKEN_KEY, refreshToken, 7); // 7 days
}

export function clearTokens() {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
}

/** Extract user info from the stored access token. */
export function getUserFromToken(): UserInfo | null {
  const token = getAccessToken();
  if (!token) return null;
  if (isTokenExpired(token)) return null;
  const payload = decodeJwt(token);
  if (!payload) return null;
  return {
    id: payload.userId ? String(payload.userId) : undefined,
    email: payload.sub,
    username: payload.username || payload.sub.split("@")[0],
  };
}
