import { Router } from "express";
import { listContent, upsertContent, listStats, upsertStat } from "../controllers/contentController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { upsertContentSchema, upsertStatSchema } from "../validators/contentValidators.js";

const contentRouter = Router();
contentRouter.get("/", listContent);
contentRouter.patch("/", requireAuth, requireRole("admin"), validate(upsertContentSchema), upsertContent);

const statsRouter = Router();
statsRouter.get("/", listStats);
statsRouter.patch("/", requireAuth, requireRole("admin"), validate(upsertStatSchema), upsertStat);

export { contentRouter, statsRouter };
