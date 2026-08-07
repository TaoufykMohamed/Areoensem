import { z } from "zod";

export const createBoardMemberSchema = z.object({
  nom: z.string().min(1),
  posteFr: z.string().min(1),
  posteEn: z.string().optional().default(""),
  photo: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  email: z.string().optional().default(""),
  mandat: z.string().min(1),
  ordre: z.number().int().optional().default(0),
});

export const updateBoardMemberSchema = createBoardMemberSchema.partial();
