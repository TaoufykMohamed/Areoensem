import { z } from "zod";

export const createProductSchema = z.object({
  nomFr: z.string().min(1),
  nomEn: z.string().optional().default(""),
  descriptionFr: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  images: z.array(z.string()).optional().default([]),
  video: z.string().optional().default(""),
  prix: z.number().min(0),
  tailles: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0).optional().default(0),
  disponible: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const createOrderSchema = z.object({
  produit: z.string().min(1),
  nom: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().min(1),
  adresse: z.string().optional().default(""),
  taille: z.string().optional().default(""),
  quantite: z.number().int().min(1).optional().default(1),
});

export const updateOrderStatutSchema = z.object({
  statut: z.enum(["en_attente", "confirmee", "annulee"]),
});
