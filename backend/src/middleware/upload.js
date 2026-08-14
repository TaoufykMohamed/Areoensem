import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

// Les images sont stockées en base64 dans MongoDB (voir partner.controller.js) :
// on garde cette limite basse pour ne pas alourdir la réponse /partners à chaque
// chargement de la page d'accueil.
const MAX_SIZE = 1 * 1024 * 1024; // 1 Mo

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(ApiError.badRequest("Le fichier doit être une image."));
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

/** Multer coupé du reste : convertit ses erreurs en ApiError avant errorHandler. */
export function uploadSingleImage(fieldName) {
  const middleware = upload.single(fieldName);
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        const message =
          err.code === "LIMIT_FILE_SIZE" ? "Fichier trop volumineux (1 Mo max)." : err.message;
        return next(ApiError.badRequest(message));
      }
      if (err) return next(err);
      next();
    });
  };
}
