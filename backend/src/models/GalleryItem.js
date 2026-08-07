import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    legendeFr: { type: String, default: "" },
    legendeEn: { type: String, default: "" },
    cellule: { type: mongoose.Schema.Types.ObjectId, ref: "Cell" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

galleryItemSchema.index({ cellule: 1 });
galleryItemSchema.index({ event: 1 });
galleryItemSchema.index({ date: -1 });

export const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
