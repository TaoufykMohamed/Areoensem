import { Router } from "express";
import { Product } from "../models/index.js";
import { listAll, getOne, createOne, updateOne, deleteOne } from "../utils/crudFactory.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { createProductSchema, updateProductSchema } from "../validators/productValidators.js";

const router = Router();

router.get("/", listAll(Product, { sort: { createdAt: -1 } }));
router.get("/:id", getOne(Product));

router.use(requireAuth, requireRole("admin"));
router.post("/", validate(createProductSchema), createOne(Product));
router.patch("/:id", validate(updateProductSchema), updateOne(Product));
router.delete("/:id", deleteOne(Product));

export default router;
