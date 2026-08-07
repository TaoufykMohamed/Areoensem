import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const membreSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    roleFr: { type: String, required: true },
    roleEn: { type: String, required: true },
    photo: { type: String, default: "" },
  },
  { _id: true }
);

const projetSchema = new mongoose.Schema(
  {
    titreFr: { type: String, required: true },
    titreEn: { type: String, required: true },
    descriptionFr: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    image: { type: String, default: "" },
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
    nomEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    descriptionCourteFr: { type: String, required: true },
    descriptionCourteEn: { type: String, required: true },
    descriptionLongueFr: { type: String, default: "" },
    descriptionLongueEn: { type: String, default: "" },
    icone: { type: String, default: "" },
    image: { type: String, default: "" },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    membres: [membreSchema],
    technologies: [{ type: String, trim: true }],
    projets: [projetSchema],
    ordre: { type: Number, default: 0 },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

cellSchema.pre("validate", function (next) {
  if (!this.slug && this.nomFr) {
    this.slug = slugify(this.nomFr);
  }
  next();
});

cellSchema.index({ ordre: 1 });

export const Cell = mongoose.model("Cell", cellSchema);
