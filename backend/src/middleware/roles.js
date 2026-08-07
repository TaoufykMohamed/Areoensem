import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}

/**
 * Autorise l'écriture uniquement si :
 *  - req.user est admin (accès total), ou
 *  - req.user est chef_cellule ET la ressource ciblée appartient à sa
 *    cellule (req.user.cellule).
 *
 * `Model`     : modèle Mongoose de la ressource à charger.
 * `param`     : nom du paramètre de route contenant l'id (défaut "id").
 * `cellField` : chemin vers la cellule sur la ressource — "_id" si la
 *               ressource EST la cellule (ex. PATCH /cells/:id), ou le nom
 *               du champ de référence sinon (ex. "cellule" pour un Event,
 *               un GalleryItem, ou une sous-ressource comme un projet).
 *
 * Une ressource inexistante reste un 404 classique (aucune fuite : les
 * cellules/événements sont de toute façon listés publiquement). Mais une
 * ressource qui existe et n'appartient pas à l'appelant renvoie 403, pas
 * 404 — piège classique du `findOne({ _id, cellule })` qui confond les
 * deux cas dans un même null.
 */
export function requireCellOwnership({ model, param = "id", cellField = "_id" }) {
  return asyncHandler(async (req, res, next) => {
    if (req.user.role === "admin") return next();

    if (req.user.role !== "chef_cellule") {
      return next(ApiError.forbidden());
    }

    const resource = await model.findById(req.params[param]).select(cellField);
    if (!resource) return next(ApiError.notFound());

    const targetCelluleId = cellField === "_id" ? resource._id : resource[cellField];

    if (!targetCelluleId || !req.user.cellule || targetCelluleId.toString() !== req.user.cellule.toString()) {
      return next(ApiError.forbidden("Vous ne pouvez modifier que votre propre cellule."));
    }

    req.resource = resource;
    next();
  });
}
