import { z } from "zod";

export const createEventSchema = z.object({
  titreFr: z.string().min(1),
  titreEn: z.string().optional().default(""),
  descriptionFr: z.string().min(1),
  descriptionEn: z.string().optional().default(""),
  affiche: z.string().optional().default(""),
  dateDebut: z.coerce.date(),
  dateFin: z.coerce.date(),
  lieuFr: z.string().min(1),
  lieuEn: z.string().optional().default(""),
  cellule: z.string().min(1),
  inscriptionsOuvertes: z.boolean().optional().default(false),
  capacite: z.number().int().nullable().optional(),
  galerie: z.array(z.string()).optional().default([]),
  compteRenduFr: z.string().optional().default(""),
  compteRenduEn: z.string().optional().default(""),
  invites: z.array(z.string()).optional().default([]),
});

export const updateEventSchema = createEventSchema.partial();

export const registerEventSchema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().min(1),
  filiere: z.string().min(1),
  annee: z.string().min(1),
  motivation: z.string().optional().default(""),
});
