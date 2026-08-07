import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const eventSchema = new mongoose.Schema(
  {
    titreFr: { type: String, required: true, trim: true },
    titreEn: { type: String, default: "", trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    descriptionFr: { type: String, required: true },
    descriptionEn: { type: String, default: "" },
    affiche: { type: String, default: "" },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    lieuFr: { type: String, required: true },
    lieuEn: { type: String, default: "" },
    cellule: { type: mongoose.Schema.Types.ObjectId, ref: "Cell", required: true },
    inscriptionsOuvertes: { type: Boolean, default: false },
    capacite: { type: Number, default: null },
    galerie: [{ type: String }],
    compteRenduFr: { type: String, default: "" },
    compteRenduEn: { type: String, default: "" },
    nombreParticipants: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// `statut` est dérivé de dateDebut/dateFin, jamais stocké : un événement
// "à venir" devient "passé" tout seul le lendemain de sa date de fin, sans
// tâche de fond à faire tourner.
eventSchema.virtual("statut").get(function () {
  const now = new Date();
  if (now < this.dateDebut) return "a_venir";
  if (now > this.dateFin) return "passe";
  return "en_cours";
});

// Traduit un statut logique en filtre Mongo sur les dates, pour les
// contrôleurs qui reçoivent `?statut=a_venir` etc.
eventSchema.statics.statutFilter = function (statut, now = new Date()) {
  switch (statut) {
    case "a_venir":
      return { dateDebut: { $gt: now } };
    case "en_cours":
      return { dateDebut: { $lte: now }, dateFin: { $gte: now } };
    case "passe":
      return { dateFin: { $lt: now } };
    default:
      return {};
  }
};

// Le slug n'est généré qu'à la création (jamais si le titre est modifié
// ensuite, pour ne pas casser les URL déjà partagées) et suffixé par
// l'année pour distinguer les éditions récurrentes ("Journées
// Aéronautiques 2025" / "... 2026").
eventSchema.pre("validate", async function () {
  if (this.isNew && !this.slug && this.titreFr) {
    const titreSlug = slugify(this.titreFr);
    const year = this.dateDebut ? String(new Date(this.dateDebut).getFullYear()) : undefined;
    // Certains titres contiennent déjà l'année ("Journées Aéronautiques
    // 2026") : ne pas la dupliquer dans le slug.
    const base = year && !titreSlug.endsWith(year) ? `${titreSlug}-${year}` : titreSlug;
    this.slug = await ensureUniqueSlug(this.constructor, base);
  }
});

eventSchema.index({ dateDebut: 1 });
eventSchema.index({ dateFin: 1 });
eventSchema.index({ cellule: 1 });

export const Event = mongoose.model("Event", eventSchema);
