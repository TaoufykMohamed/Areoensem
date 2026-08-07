import { Router } from "express";
import { createOrder, listOrders, updateOrderStatut } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema, updateOrderStatutSchema } from "../validators/productValidators.js";
import { publicFormLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/", publicFormLimiter, validate(createOrderSchema), createOrder);
router.get("/", requireAuth, requireRole("admin"), listOrders);
router.patch("/:id", requireAuth, requireRole("admin"), validate(updateOrderStatutSchema), updateOrderStatut);

export default router;
