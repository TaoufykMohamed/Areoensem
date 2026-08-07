import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    telephone: { type: String, required: true },
    filiere: { type: String, required: true },
    annee: { type: String, required: true },
    celluleSouhaitee: { type: mongoose.Schema.Types.ObjectId, ref: "Cell", required: true },
    motivation: { type: String, required: true },
    statut: {
      type: String,
      enum: ["en_attente", "confirme", "refuse"],
      default: "en_attente",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

applicationSchema.index({ celluleSouhaitee: 1, statut: 1 });
applicationSchema.index({ createdAt: -1 });

export const Application = mongoose.model("Application", applicationSchema);
