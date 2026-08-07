import { User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).populate("cellule", "nomFr slug");
  res.json({ success: true, data: users, message: null });
});

// Sert notamment à créer les comptes chefs de cellule et à les rattacher
// à une cellule (le hash du mot de passe est géré par le hook du modèle).
export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user, message: null });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  // updateUserSchema n'expose jamais motDePasse : findByIdAndUpdate ne
  // déclenche pas le hook de hachage, donc ce champ ne doit jamais
  // transiter par cette route (voir PATCH /auth/password à la place).
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(ApiError.notFound());
  res.json({ success: true, data: user, message: null });
});
