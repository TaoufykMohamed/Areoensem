import { z } from "zod";

export const createPartnerSchema = z.object({
  nom: z.string().min(1),
  logo: z.string().optional().default(""),
  siteWeb: z.string().optional().default(""),
  type: z.enum(["sponsor", "partenaire", "ecole"]),
  ordre: z.number().int().optional().default(0),
});

export const updatePartnerSchema = createPartnerSchema.partial();
