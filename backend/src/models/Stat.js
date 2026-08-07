import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    cle: { type: String, required: true, unique: true, trim: true },
    labelFr: { type: String, required: true },
    labelEn: { type: String, default: "" },
    valeur: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Stat = mongoose.model("Stat", statSchema);
