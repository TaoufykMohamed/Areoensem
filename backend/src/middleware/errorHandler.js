import { ApiError } from "../utils/ApiError.js";
import { isProd } from "../config/env.js";

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route introuvable : ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] ?? "valeur";
    return res.status(409).json({
      success: false,
      data: null,
      message: `Cette valeur pour "${field}" est déjà utilisée.`,
    });
  }

  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = isApiError ? err.message : "Erreur interne du serveur";

  if (!isApiError) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    ...(err.details ? { errors: err.details } : {}),
    ...(!isProd && !isApiError ? { stack: err.stack } : {}),
  });
}
