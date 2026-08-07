import { User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";
import { authCookieOptions } from "../utils/cookieOptions.js";
import { env } from "../config/env.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, motDePasse } = req.body;

  const user = await User.findOne({ email }).select("+motDePasse");
  if (!user || !user.actif || !(await user.comparePassword(motDePasse))) {
    return next(ApiError.unauthorized("Email ou mot de passe incorrect"));
  }

  const token = signToken(user);
  res.cookie(env.COOKIE_NAME, token, authCookieOptions());

  res.json({ success: true, data: { user: user.toJSON() }, message: null });
});

export const logout = (req, res) => {
  // Mêmes options qu'au login, SAUF maxAge : sinon il prime sur le
  // Expires du passé qu'ajoute clearCookie (RFC 6265), et le cookie
  // n'est jamais réellement supprimé côté navigateur.
  const { maxAge, ...clearOptions } = authCookieOptions();
  res.clearCookie(env.COOKIE_NAME, clearOptions);
  res.json({ success: true, data: null, message: null });
};

export const me = (req, res) => {
  res.json({ success: true, data: { user: req.user.toJSON() }, message: null });
};

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { ancienMotDePasse, nouveauMotDePasse } = req.body;

  const user = await User.findById(req.user._id).select("+motDePasse");
  if (!(await user.comparePassword(ancienMotDePasse))) {
    return next(ApiError.badRequest("Ancien mot de passe incorrect"));
  }

  user.motDePasse = nouveauMotDePasse;
  await user.save();

  res.json({ success: true, data: null, message: "Mot de passe mis à jour" });
});
