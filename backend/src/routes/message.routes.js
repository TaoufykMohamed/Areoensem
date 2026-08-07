import { Router } from "express";
import { createMessage, listMessages, markMessageRead } from "../controllers/messageController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { createMessageSchema } from "../validators/messageValidators.js";
import { publicFormLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/", publicFormLimiter, validate(createMessageSchema), createMessage);
router.get("/", requireAuth, requireRole("admin"), listMessages);
router.patch("/:id", requireAuth, requireRole("admin"), markMessageRead);

export default router;
