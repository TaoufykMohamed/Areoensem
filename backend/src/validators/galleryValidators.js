import { z } from "zod";

export const createGalleryItemSchema = z.object({
  image: z.string().min(1),
  legendeFr: z.string().optional().default(""),
  legendeEn: z.string().optional().default(""),
  descriptionFr: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  cellule: z.string().optional(),
  event: z.string().optional(),
  date: z.coerce.date().optional(),
});

export const updateGalleryItemSchema = createGalleryItemSchema.partial();
