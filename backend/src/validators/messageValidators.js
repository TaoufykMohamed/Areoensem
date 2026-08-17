import { z } from "zod";

const emailSchema = z.string().email();

// Le formulaire de contact (type "contact") exige nom/email/sujet ; le
// widget de feedback rapide (type "feedback", voir FeedbackWidget.jsx) est
// anonyme — seul le message compte.
export const createMessageSchema = z
  .object({
    nom: z.string().optional().default(""),
    email: z.string().optional().default(""),
    sujet: z.string().optional().default("Feedback"),
    contenu: z.string().min(1),
    type: z.enum(["contact", "feedback"]).optional().default("contact"),
    event: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "contact") return;
    if (!data.nom.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nom"], message: "Requis" });
    }
    if (!emailSchema.safeParse(data.email).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["email"], message: "Email invalide" });
    }
    if (!data.sujet.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sujet"], message: "Requis" });
    }
  });
