import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "./ApiError.js";

// Petites fonctions composables pour les ressources en CRUD simple
// (Board, Partners, Products, Stats, ...). Les ressources avec une
// logique métier propre (Cell, Event, Application, ...) ont leur
// contrôleur écrit à la main.

export function listAll(Model, { sort = {}, populate } = {}) {
  return asyncHandler(async (req, res) => {
    let query = Model.find().sort(sort);
    if (populate) query = query.populate(populate);
    const items = await query;
    res.json({ success: true, data: items, message: null });
  });
}

export function getOne(Model, { param = "id", populate } = {}) {
  return asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params[param]);
    if (populate) query = query.populate(populate);
    const item = await query;
    if (!item) return next(ApiError.notFound());
    res.json({ success: true, data: item, message: null });
  });
}

export function getOneBySlug({ param = "slug", populate } = {}) {
  return (Model) =>
    asyncHandler(async (req, res, next) => {
      let query = Model.findOne({ slug: req.params[param] });
      if (populate) query = query.populate(populate);
      const item = await query;
      if (!item) return next(ApiError.notFound());
      res.json({ success: true, data: item, message: null });
    });
}

export function createOne(Model) {
  return asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item, message: null });
  });
}

export function updateOne(Model, { param = "id" } = {}) {
  return asyncHandler(async (req, res, next) => {
    const item = await Model.findByIdAndUpdate(req.params[param], req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return next(ApiError.notFound());
    res.json({ success: true, data: item, message: null });
  });
}

export function deleteOne(Model, { param = "id" } = {}) {
  return asyncHandler(async (req, res, next) => {
    const item = await Model.findByIdAndDelete(req.params[param]);
    if (!item) return next(ApiError.notFound());
    res.json({ success: true, data: null, message: null });
  });
}
