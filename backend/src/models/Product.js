import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nomFr: { type: String, required: true, trim: true },
    nomEn: { type: String, default: "", trim: true },
    descriptionFr: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    images: [{ type: String }],
    // Vignette statique affichée dans la grille Store (légère, chargée pour
    // tous les produits). La vidéo, elle, n'est envoyée qu'à l'ouverture de
    // la fiche produit (GET /products/:id) — voir listProducts, qui exclut
    // `video` de la liste. Voir MAX_VIDEO_SIZE dans upload.js.
    poster: { type: String, default: "" },
    // Aperçu vidéo (autoplay/loop/muted) affiché dans la modale du produit.
    video: { type: String, default: "" },
    prix: { type: Number, required: true, min: 0 },
    tailles: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ disponible: 1 });
// La liste (GET /products) trie par createdAt : sans index, Mongo doit
// trier tous les documents en mémoire — et depuis que Product embarque une
// vidéo en base64 (jusqu'à ~10.7 Mo/document), quelques produits suffisent
// à dépasser la limite de tri en mémoire d'Atlas (32 Mo), faisant échouer
// la requête entière (aucun produit ne s'affiche, ni au dashboard ni sur
// le Store). L'index permet un tri via l'index plutôt qu'en mémoire.
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model("Product", productSchema);
