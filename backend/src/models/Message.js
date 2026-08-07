import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    sujet: { type: String, required: true },
    contenu: { type: String, required: true },
    lu: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ lu: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);
