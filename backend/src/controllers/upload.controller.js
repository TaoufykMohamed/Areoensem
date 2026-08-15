import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Convertit le fichier reçu (via middleware/upload.js) en data URI base64 et
// le renvoie tel quel — c'est ce que les ressources (Partner.logo,
// GalleryItem.image, ...) stockent directement en base, sans service tiers.
export const uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(ApiError.badRequest("Aucun fichier reçu."));
  }

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  res.status(201).json({ success: true, data: { url: dataUri }, message: null });
});
