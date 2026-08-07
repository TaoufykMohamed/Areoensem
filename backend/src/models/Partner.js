import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    logo: { type: String, default: "" },
    siteWeb: { type: String, default: "" },
    type: {
      type: String,
      enum: ["sponsor", "partenaire", "ecole"],
      required: true,
    },
    ordre: { type: Number, default: 0 },
  },
  { timestamps: true }
);

partnerSchema.index({ type: 1, ordre: 1 });

export const Partner = mongoose.model("Partner", partnerSchema);
