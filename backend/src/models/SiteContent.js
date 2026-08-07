import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    cle: { type: String, required: true, unique: true, trim: true },
    valeurFr: { type: String, required: true },
    valeurEn: { type: String, required: true },
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
