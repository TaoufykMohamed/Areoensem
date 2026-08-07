import { isProd } from "../config/env.js";

// Doit rester cohérent avec JWT_EXPIRES_IN (7d par défaut) — le cookie
// expire en même temps que le token qu'il transporte.
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: SEVEN_DAYS_MS,
  };
}
