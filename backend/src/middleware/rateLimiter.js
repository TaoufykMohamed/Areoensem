import rateLimit from "express-rate-limit";

// Endpoints sensibles (login) : peu de tentatives, fenêtre courte.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: "Trop de tentatives, réessayez dans quelques minutes.",
  },
});

// Formulaires publics (contact, candidature, inscription, commande) : anti-spam.
export const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: "Trop de requêtes, réessayez plus tard.",
  },
});
