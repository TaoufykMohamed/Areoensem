import { z } from "zod";

export const createMessageSchema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  sujet: z.string().min(1),
  contenu: z.string().min(1),
});
