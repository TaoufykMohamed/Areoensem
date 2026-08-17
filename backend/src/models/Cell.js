import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const membreSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    roleFr: { type: String, required: true },
    roleEn: { type: String, default: "" },
    photo: { type: String, default: "" },
  },
  { _id: true }
);

const projetSchema = new mongoose.Schema(
  {
    titreFr: { type: String, required: true },
    titreEn: { type: String, default: "" },
    descriptionFr: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    image: { type: String, default: "" },
    documentUrl: { type: String, default: "" },
    statut: {
      type: String,
      enum: ["a_venir", "en_cours", "termine"],
      default: "en_cours",
    },
    annee: { type: Number },
  },
  { _id: true }
);

const cellSchema = new mongoose.Schema(
  {
    nomFr: { type: String, required: true, trim: true },
    nomEn: { type: String, default: "", trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    descriptionCourteFr: { type: String, required: true },
    descriptionCourteEn: { type: String, default: "" },
    descriptionLongueFr: { type: String, default: "" },
    descriptionLongueEn: { type: String, default: "" },
    objectifsFr: [{ type: String, trim: true }],
    objectifsEn: [{ type: String, trim: true }],
    icone: { type: String, default: "" },
    image: { type: String, default: "" },
    membres: [membreSchema],
    technologies: [{ type: String, trim: true }],
    projets: [projetSchema],
    ordre: { type: Number, default: 0 },
    actif: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Le chef de cellule n'est PAS stocké ici : User.cellule est la seule
// source de vérité (sinon les deux finissent par diverger le jour où un
// admin réaffecte un chef). Il faut appeler .populate("chef") côté
// contrôleur pour le récupérer.
cellSchema.virtual("chef", {
  ref: "User",
  localField: "_id",
  foreignField: "cellule",
  justOne: true,
  match: { role: "chef_cellule" },
});

// Slug généré une seule fois, à la création — jamais régénéré si le nom
// change ensuite, pour ne pas casser les URL déjà partagées.
cellSchema.pre("validate", async function () {
  if (this.isNew && !this.slug && this.nomFr) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.nomFr));
  }
});

cellSchema.index({ ordre: 1 });

export const Cell = mongoose.model("Cell", cellSchema);
