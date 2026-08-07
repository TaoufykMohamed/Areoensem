import { z } from "zod";

const membreSchema = z.object({
  nom: z.string().min(1),
  roleFr: z.string().min(1),
  roleEn: z.string().optional().default(""),
  photo: z.string().optional().default(""),
});

const projetSchema = z.object({
  titreFr: z.string().min(1),
  titreEn: z.string().optional().default(""),
  descriptionFr: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  image: z.string().optional().default(""),
  statut: z.enum(["a_venir", "en_cours", "termine"]).optional().default("en_cours"),
  annee: z.number().int().optional(),
});

export const createCellSchema = z.object({
  nomFr: z.string().min(1),
  nomEn: z.string().optional().default(""),
  descriptionCourteFr: z.string().min(1),
  descriptionCourteEn: z.string().optional().default(""),
  descriptionLongueFr: z.string().optional().default(""),
  descriptionLongueEn: z.string().optional().default(""),
  icone: z.string().optional().default(""),
  image: z.string().optional().default(""),
  membres: z.array(membreSchema).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  projets: z.array(projetSchema).optional().default([]),
  ordre: z.number().int().optional().default(0),
  actif: z.boolean().optional().default(true),
});

export const updateCellSchema = createCellSchema.partial();
