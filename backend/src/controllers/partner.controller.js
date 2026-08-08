import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";

export const uploadLogo = asyncHandler(async (req, res, next) => {
  if (!isCloudinaryConfigured) {
    return next(
      ApiError.badRequest(
        "Téléversement d'images indisponible : variables CLOUDINARY_* non configurées côté serveur."
      )
    );
  }
  if (!req.file) {
    return next(ApiError.badRequest("Aucun fichier reçu."));
  }

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "aeroensem/partners",
    resource_type: "image",
  });

  res.status(201).json({ success: true, data: { url: result.secure_url }, message: null });
});
