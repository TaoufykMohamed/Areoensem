import { Event, Registration } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listEvents = asyncHandler(async (req, res) => {
  const { statut, cellule } = req.query;
  const filter = { ...(statut ? Event.statutFilter(statut) : {}), ...(cellule ? { cellule } : {}) };
  const events = await Event.find(filter).sort({ dateDebut: 1 }).populate("cellule", "nomFr nomEn slug");
  res.json({ success: true, data: events, message: null });
});

export const getEventBySlug = asyncHandler(async (req, res, next) => {
  const event = await Event.findOne({ slug: req.params.slug }).populate("cellule", "nomFr nomEn slug");
  if (!event) return next(ApiError.notFound());
  res.json({ success: true, data: event, message: null });
});

// Pas de ressource existante à charger avant création : on compare
// directement la cellule demandée dans le corps à celle du chef.
function assertCanWriteForCellule(user, celluleId) {
  if (user.role === "admin") return;
  if (user.role === "chef_cellule" && user.cellule?.toString() === celluleId) return;
  throw ApiError.forbidden("Vous ne pouvez gérer que les événements de votre propre cellule.");
}

export const createEvent = asyncHandler(async (req, res) => {
  assertCanWriteForCellule(req.user, req.body.cellule);
  const event = await Event.create(req.body);
  res.status(201).json({ success: true, data: event, message: null });
});

export const updateEvent = asyncHandler(async (req, res, next) => {
  const existing = req.resource; // posé par requireCellOwnership
  if (!existing) return next(ApiError.notFound());

  if (req.body.cellule) {
    assertCanWriteForCellule(req.user, req.body.cellule);
  }

  const { slug, ...updates } = req.body;
  const event = await Event.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("cellule", "nomFr nomEn slug");
  res.json({ success: true, data: event, message: null });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ success: true, data: null, message: null });
});

export const registerForEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(ApiError.notFound());
  if (!event.inscriptionsOuvertes) {
    return next(ApiError.badRequest("Les inscriptions ne sont pas ouvertes pour cet événement."));
  }
  if (event.capacite && event.nombreParticipants >= event.capacite) {
    return next(ApiError.badRequest("Cet événement est complet."));
  }

  const registration = await Registration.create({ ...req.body, event: event._id });
  event.nombreParticipants += 1;
  await event.save();

  res.status(201).json({ success: true, data: registration, message: null });
});

export const listEventRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ event: req.params.id }).sort({ createdAt: -1 });
  res.json({ success: true, data: registrations, message: null });
});
