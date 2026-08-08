import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

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
          err.code === "LIMIT_FILE_SIZE" ? "Fichier trop volumineux (5 Mo max)." : err.message;
        return next(ApiError.badRequest(message));
      }
      if (err) return next(err);
      next();
    });
  };
}
