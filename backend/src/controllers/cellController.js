import { Cell } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// photo retiré : ni la fiche cellule ni la modale n'affichent la photo du
// chef — inutile d'alourdir chaque réponse d'un portrait en base64.
const CHEF_FIELDS = "nom email linkedin";
// Idem pour la photo de chaque membre et l'image de chaque projet : aucun
// écran ne les affiche (seuls nom/rôle et titre/description/dossier PDF le
// sont) alors qu'ils peuvent peser plusieurs Mo par cellule.
const SKIP_UNUSED_MEDIA = { "membres.photo": 0, "projets.image": 0 };

export const listCells = asyncHandler(async (req, res) => {
  const cells = await Cell.find({}, SKIP_UNUSED_MEDIA).sort({ ordre: 1 }).populate("chef", CHEF_FIELDS);
  res.json({ success: true, data: cells, message: null });
});

export const getCellBySlug = asyncHandler(async (req, res, next) => {
  const cell = await Cell.findOne({ slug: req.params.slug }, SKIP_UNUSED_MEDIA).populate("chef", CHEF_FIELDS);
  if (!cell) return next(ApiError.notFound());
  res.json({ success: true, data: cell, message: null });
});

export const createCell = asyncHandler(async (req, res) => {
  const cell = await Cell.create(req.body);
  res.status(201).json({ success: true, data: cell, message: null });
});

export const updateCell = asyncHandler(async (req, res, next) => {
  // slug volontairement non modifiable ici (immuable après création, cf. modèle)
  const { slug, ...updates } = req.body;
  const cell = await Cell.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("chef", CHEF_FIELDS);
  if (!cell) return next(ApiError.notFound());
  res.json({ success: true, data: cell, message: null });
});

export const deleteCell = asyncHandler(async (req, res, next) => {
  const cell = await Cell.findByIdAndDelete(req.params.id);
  if (!cell) return next(ApiError.notFound());
  res.json({ success: true, data: null, message: null });
});
