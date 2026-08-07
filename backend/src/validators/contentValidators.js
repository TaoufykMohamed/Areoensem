import { z } from "zod";

export const upsertContentSchema = z.object({
  cle: z.string().min(1),
  valeurFr: z.string().min(1),
  valeurEn: z.string().optional().default(""),
});

export const upsertStatSchema = z.object({
  cle: z.string().min(1),
  labelFr: z.string().min(1),
  labelEn: z.string().optional().default(""),
  valeur: z.number(),
});
