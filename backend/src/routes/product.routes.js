import { Router } from "express";
import { Product } from "../models/index.js";
import { listAll, getOne, createOne, updateOne, deleteOne } from "../utils/crudFactory.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { uploadSingleImage, uploadSingleVideo } from "../middleware/upload.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { createProductSchema, updateProductSchema } from "../validators/productValidators.js";

const router = Router();

// La liste (grille Store) n'a besoin que de la vignette : la vidéo/les
// anciennes images ne sont chargées qu'à l'ouverture d'un produit précis
// (GET /products/:id, sans restriction de champs), pour ne pas faire
// télécharger la vidéo de chaque produit visible juste pour afficher la
// grille.
router.get("/", listAll(Product, { sort: { createdAt: -1 }, select: "-video -images" }));
router.get("/:id", getOne(Product));

router.use(requireAuth, requireRole("admin"));
router.post("/upload-poster", uploadSingleImage("poster"), uploadImage);
router.post("/upload-video", uploadSingleVideo("video"), uploadImage);
router.post("/", validate(createProductSchema), createOne(Product));
router.patch("/:id", validate(updateProductSchema), updateOne(Product));
router.delete("/:id", deleteOne(Product));

export default router;
