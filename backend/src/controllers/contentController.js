import { SiteContent, Stat } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Lecture publique (textes/chiffres affichés sur l'accueil), écriture
// admin uniquement — la mention "(admin)" du cahier des charges vise
// l'édition, pas la lecture, sinon la page d'accueil ne pourrait jamais
// afficher ces contenus aux visiteurs anonymes.

export const listContent = asyncHandler(async (req, res) => {
  const content = await SiteContent.find();
  res.json({ success: true, data: content, message: null });
});

export const upsertContent = asyncHandler(async (req, res) => {
  const { cle, ...updates } = req.body;
  const content = await SiteContent.findOneAndUpdate({ cle }, updates, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  res.json({ success: true, data: content, message: null });
});

export const listStats = asyncHandler(async (req, res) => {
  const stats = await Stat.find();
  res.json({ success: true, data: stats, message: null });
});

export const upsertStat = asyncHandler(async (req, res) => {
  const { cle, ...updates } = req.body;
  const stat = await Stat.findOneAndUpdate({ cle }, updates, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  res.json({ success: true, data: stat, message: null });
});
