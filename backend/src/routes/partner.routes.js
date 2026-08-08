import { Router } from "express";
import { Partner } from "../models/index.js";
import { listAll, getOne, createOne, updateOne, deleteOne } from "../utils/crudFactory.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { uploadSingleImage } from "../middleware/upload.js";
import { uploadLogo } from "../controllers/partner.controller.js";
import { createPartnerSchema, updatePartnerSchema } from "../validators/partnerValidators.js";

const router = Router();
const sort = { type: 1, ordre: 1 };

router.get("/", listAll(Partner, { sort }));
router.get("/:id", getOne(Partner));

router.use(requireAuth, requireRole("admin"));
router.post("/upload", uploadSingleImage("logo"), uploadLogo);
router.post("/", validate(createPartnerSchema), createOne(Partner));
router.patch("/:id", validate(updatePartnerSchema), updateOne(Partner));
router.delete("/:id", deleteOne(Partner));

export default router;
