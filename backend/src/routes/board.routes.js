import { Router } from "express";
import { BoardMember } from "../models/index.js";
import { listAll, getOne, createOne, updateOne, deleteOne } from "../utils/crudFactory.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { createBoardMemberSchema, updateBoardMemberSchema } from "../validators/boardMemberValidators.js";

const router = Router();
const sort = { ordre: 1 };

router.get("/", listAll(BoardMember, { sort }));
router.get("/:id", getOne(BoardMember));

router.use(requireAuth, requireRole("admin"));
router.post("/", validate(createBoardMemberSchema), createOne(BoardMember));
router.patch("/:id", validate(updateBoardMemberSchema), updateOne(BoardMember));
router.delete("/:id", deleteOne(BoardMember));

export default router;
