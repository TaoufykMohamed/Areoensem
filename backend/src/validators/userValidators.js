import { z } from "zod";

export const createUserSchema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  motDePasse: z.string().min(8),
  role: z.enum(["admin", "chef_cellule"]),
  cellule: z.string().min(1).optional(),
  photo: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
});

export const updateUserSchema = z.object({
  nom: z.string().min(1).optional(),
  cellule: z.string().min(1).optional(),
  photo: z.string().optional(),
  linkedin: z.string().optional(),
  actif: z.boolean().optional(),
});
