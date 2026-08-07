import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const eventSchema = new mongoose.Schema(
  {
    titreFr: { type: String, required: true, trim: true },
    titreEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    descriptionFr: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    affiche: { type: String, default: "" },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    lieuFr: { type: String, required: true },
    lieuEn: { type: String, required: true },
    cellule: { type: mongoose.Schema.Types.ObjectId, ref: "Cell", required: true },
    statut: {
      type: String,
      enum: ["a_venir", "en_cours", "passe"],
      default: "a_venir",
    },
    inscriptionsOuvertes: { type: Boolean, default: false },
    capacite: { type: Number, default: null },
    galerie: [{ type: String }],
    compteRenduFr: { type: String, default: "" },
    compteRenduEn: { type: String, default: "" },
    nombreParticipants: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eventSchema.pre("validate", function (next) {
  if (!this.slug && this.titreFr) {
    this.slug = slugify(this.titreFr);
  }
  next();
});

eventSchema.index({ dateDebut: 1 });
eventSchema.index({ statut: 1, dateDebut: 1 });
eventSchema.index({ cellule: 1 });

export const Event = mongoose.model("Event", eventSchema);
