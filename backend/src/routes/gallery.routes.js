import { Router } from "express";
import {
  listGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole, requireCellOwnership } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { createGalleryItemSchema } from "../validators/galleryValidators.js";
import { GalleryItem } from "../models/index.js";

const router = Router();

router.get("/", listGalleryItems);

router.post(
  "/",
  requireAuth,
  requireRole("admin", "chef_cellule"),
  validate(createGalleryItemSchema),
  createGalleryItem
);
router.delete(
  "/:id",
  requireAuth,
  requireCellOwnership({ model: GalleryItem, cellField: "cellule" }),
  deleteGalleryItem
);

export default router;
