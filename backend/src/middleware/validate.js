import { ApiError } from "../utils/ApiError.js";

/**
 * Valide req.body avec un schéma Zod et remplace req.body par la version
 * parsée (types coercés, champs inconnus retirés). Utilisé identiquement
 * par toutes les ressources à partir de l'étape 4.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(ApiError.badRequest("Requête invalide", result.error.flatten().fieldErrors));
    }
    req.body = result.data;
    next();
  };
}
