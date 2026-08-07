import mongoose from "mongoose";

const boardMemberSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    posteFr: { type: String, required: true },
    posteEn: { type: String, required: true },
    photo: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    email: { type: String, default: "" },
    mandat: { type: String, required: true },
    ordre: { type: Number, default: 0 },
  },
  { timestamps: true }
);

boardMemberSchema.index({ ordre: 1 });

export const BoardMember = mongoose.model("BoardMember", boardMemberSchema);
