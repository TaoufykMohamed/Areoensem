import { Router } from "express";
import { login, logout, me, updatePassword } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, updatePasswordSchema } from "../validators/authValidators.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.patch("/password", requireAuth, validate(updatePasswordSchema), updatePassword);

export default router;
