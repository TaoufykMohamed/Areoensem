import { Router } from "express";
import {
  createApplication,
  listApplications,
  updateApplicationStatut,
} from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { createApplicationSchema, updateStatutSchema } from "../validators/applicationValidators.js";
import { publicFormLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/", publicFormLimiter, validate(createApplicationSchema), createApplication);
router.get("/", requireAuth, requireRole("admin"), listApplications);
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validate(updateStatutSchema),
  updateApplicationStatut
);

export default router;
