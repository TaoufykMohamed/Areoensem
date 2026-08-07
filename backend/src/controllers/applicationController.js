import { Application } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createApplication = asyncHandler(async (req, res) => {
  const application = await Application.create(req.body);
  res.status(201).json({ success: true, data: application, message: null });
});

export const listApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .sort({ createdAt: -1 })
    .populate("celluleSouhaitee", "nomFr nomEn slug");
  res.json({ success: true, data: applications, message: null });
});

export const updateApplicationStatut = asyncHandler(async (req, res, next) => {
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { statut: req.body.statut },
    { new: true, runValidators: true }
  );
  if (!application) return next(ApiError.notFound());
  res.json({ success: true, data: application, message: null });
});
