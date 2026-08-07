import { z } from "zod";

export const createApplicationSchema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().min(1),
  filiere: z.string().min(1),
  annee: z.string().min(1),
  celluleSouhaitee: z.string().min(1),
  motivation: z.string().min(1),
});

export const updateStatutSchema = z.object({
  statut: z.enum(["en_attente", "confirme", "refuse"]),
});
