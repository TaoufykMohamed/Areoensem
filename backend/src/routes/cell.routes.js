import { Router } from "express";
import {
  listCells,
  getCellBySlug,
  createCell,
  updateCell,
  deleteCell,
} from "../controllers/cellController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole, requireCellOwnership } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { uploadSingleImage, uploadSingleDocument } from "../middleware/upload.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { createCellSchema, updateCellSchema } from "../validators/cellValidators.js";
import { Cell } from "../models/index.js";

const router = Router();

router.get("/", listCells);
router.get("/:slug", getCellBySlug);

router.post(
  "/upload",
  requireAuth,
  requireRole("admin", "chef_cellule"),
  uploadSingleImage("image"),
  uploadImage
);
router.post(
  "/upload-document",
  requireAuth,
  requireRole("admin", "chef_cellule"),
  uploadSingleDocument("document"),
  uploadImage
);
router.post("/", requireAuth, requireRole("admin"), validate(createCellSchema), createCell);
router.patch(
  "/:id",
  requireAuth,
  requireCellOwnership({ model: Cell, cellField: "_id" }),
  validate(updateCellSchema),
  updateCell
);
router.delete("/:id", requireAuth, requireRole("admin"), deleteCell);

export default router;
