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

// Dossiers de projet (PDF) : plus volumineux qu'un logo, limite séparée —
// mais reste modeste : ces documents s'accumulent en base64 dans le même
// document Cell (un par projet), et MongoDB plafonne un document à 16 Mo.
const MAX_DOCUMENT_SIZE = 2 * 1024 * 1024; // 2 Mo

function documentFileFilter(req, file, cb) {
  if (file.mimetype !== "application/pdf") {
    return cb(ApiError.badRequest("Le fichier doit être un PDF."));
  }
  cb(null, true);
}

const documentUpload = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: { fileSize: MAX_DOCUMENT_SIZE },
});

export function uploadSingleDocument(fieldName) {
  const middleware = documentUpload.single(fieldName);
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

// Aperçus vidéo produit (Store) : un seul par produit (pas de tableau comme
// les dossiers de projet des cellules), donc plus de marge sous les 16 Mo
// par document MongoDB — mais on reste loin de la limite pour laisser de
// la place aux autres champs et à l'inflation ~33 % du base64.
const MAX_VIDEO_SIZE = 8 * 1024 * 1024; // 8 Mo

function videoFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("video/")) {
    return cb(ApiError.badRequest("Le fichier doit être une vidéo."));
  }
  cb(null, true);
}

const videoUpload = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE },
});

export function uploadSingleVideo(fieldName) {
  const middleware = videoUpload.single(fieldName);
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        const message =
          err.code === "LIMIT_FILE_SIZE" ? "Fichier trop volumineux (8 Mo max)." : err.message;
        return next(ApiError.badRequest(message));
      }
      if (err) return next(err);
      next();
    });
  };
}
