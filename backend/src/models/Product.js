import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nomFr: { type: String, required: true, trim: true },
    nomEn: { type: String, required: true, trim: true },
    descriptionFr: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    images: [{ type: String }],
    prix: { type: Number, required: true, min: 0 },
    tailles: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ disponible: 1 });

export const Product = mongoose.model("Product", productSchema);
