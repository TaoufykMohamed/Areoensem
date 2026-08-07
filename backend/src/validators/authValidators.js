import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  motDePasse: z.string().min(1, "Mot de passe requis"),
});

export const updatePasswordSchema = z.object({
  ancienMotDePasse: z.string().min(1, "Ancien mot de passe requis"),
  nouveauMotDePasse: z.string().min(8, "8 caractères minimum"),
});
