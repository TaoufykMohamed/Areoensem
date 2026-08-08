import { isProd } from "../config/env.js";

// Doit rester cohérent avec JWT_EXPIRES_IN (7d par défaut) — le cookie
// expire en même temps que le token qu'il transporte.
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function authCookieOptions() {
  return {
    httpOnly: true,
    // "none" est obligatoire dès que frontend et backend sont sur des
    // domaines différents (Vercel + Render) : un cookie SameSite=Lax
    // n'est jamais envoyé sur une requête fetch/axios cross-site, même
    // avec credentials/withCredentials des deux côtés — seulement sur
    // une navigation top-level. SameSite=None exige secure:true, donc
    // ça ne s'active qu'en production (HTTPS) ; en dev (http://localhost)
    // on reste en "lax", même origine de toute façon.
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: SEVEN_DAYS_MS,
  };
}
