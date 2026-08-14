import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Les logos sont stockés directement en base (champ Partner.logo) sous forme
// de data URI base64 — pas de service tiers, le club n'a que quelques
// sponsors et leurs logos restent petits (cf. limite dans middleware/upload.js).
export const uploadLogo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(ApiError.badRequest("Aucun fichier reçu."));
  }

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  res.status(201).json({ success: true, data: { url: dataUri }, message: null });
});
