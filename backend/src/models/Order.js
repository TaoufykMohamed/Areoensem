import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    produit: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    telephone: { type: String, required: true },
    adresse: { type: String, default: "", trim: true },
    taille: { type: String, default: "" },
    quantite: { type: Number, required: true, min: 1, default: 1 },
    statut: {
      type: String,
      enum: ["en_attente", "confirmee", "annulee"],
      default: "en_attente",
    },
  },
  { timestamps: true }
);

orderSchema.index({ statut: 1, createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
