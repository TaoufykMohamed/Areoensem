import { Router } from "express";
import {
  listEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  listEventRegistrations,
} from "../controllers/eventController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole, requireCellOwnership } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { uploadSingleImage } from "../middleware/upload.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { createEventSchema, updateEventSchema, registerEventSchema } from "../validators/eventValidators.js";
import { publicFormLimiter } from "../middleware/rateLimiter.js";
import { Event } from "../models/index.js";

const router = Router();

const ownEvent = requireCellOwnership({ model: Event, cellField: "cellule" });

router.get("/", listEvents);
router.get("/:slug", getEventBySlug);

router.post(
  "/upload",
  requireAuth,
  requireRole("admin", "chef_cellule"),
  uploadSingleImage("affiche"),
  uploadImage
);
router.post(
  "/",
  requireAuth,
  requireRole("admin", "chef_cellule"),
  validate(createEventSchema),
  createEvent
);
router.patch("/:id", requireAuth, ownEvent, validate(updateEventSchema), updateEvent);
router.delete("/:id", requireAuth, ownEvent, deleteEvent);

router.post("/:id/register", publicFormLimiter, validate(registerEventSchema), registerForEvent);
router.get("/:id/registrations", requireAuth, ownEvent, listEventRegistrations);

export default router;
