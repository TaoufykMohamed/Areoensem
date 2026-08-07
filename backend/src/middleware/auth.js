import { verifyToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { User } from "../models/index.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (!token) return next(ApiError.unauthorized());

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return next(ApiError.unauthorized("Session invalide ou expirée"));
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.actif) return next(ApiError.unauthorized());

  req.user = user;
  next();
});
