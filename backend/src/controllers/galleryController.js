import { GalleryItem } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listGalleryItems = asyncHandler(async (req, res) => {
  const { cellule, event, limit } = req.query;
  const filter = { ...(cellule ? { cellule } : {}), ...(event ? { event } : {}) };
  let query = GalleryItem.find(filter).sort({ date: -1 });
  // Optionnel : la page d'accueil ne veut qu'un aperçu récent, le dashboard
  // (gestion complète, doit tout voir pour pouvoir supprimer) n'en passe
  // pas — comportement inchangé si absent.
  const parsedLimit = Number(limit);
  if (Number.isInteger(parsedLimit) && parsedLimit > 0) query = query.limit(parsedLimit);
  const items = await query;
  res.json({ success: true, data: items, message: null });
});

function assertCanWriteForCellule(user, celluleId) {
  if (user.role === "admin") return;
  if (user.role === "chef_cellule" && celluleId && user.cellule?.toString() === celluleId) return;
  throw ApiError.forbidden("Vous ne pouvez ajouter des photos qu'à la galerie de votre propre cellule.");
}

export const createGalleryItem = asyncHandler(async (req, res) => {
  assertCanWriteForCellule(req.user, req.body.cellule);
  const item = await GalleryItem.create(req.body);
  res.status(201).json({ success: true, data: item, message: null });
});

export const deleteGalleryItem = asyncHandler(async (req, res, next) => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id);
  if (!item) return next(ApiError.notFound());
  res.json({ success: true, data: null, message: null });
});
