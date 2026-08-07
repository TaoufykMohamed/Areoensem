import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    telephone: { type: String, required: true },
    filiere: { type: String, required: true },
    annee: { type: String, required: true },
    motivation: { type: String, default: "" },
    statut: {
      type: String,
      enum: ["en_attente", "confirme", "refuse"],
      default: "en_attente",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

registrationSchema.index({ event: 1, statut: 1 });
registrationSchema.index({ email: 1, event: 1 }, { unique: true });

export const Registration = mongoose.model("Registration", registrationSchema);
