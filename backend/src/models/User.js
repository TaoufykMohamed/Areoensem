import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    motDePasse: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "chef_cellule"],
      required: true,
    },
    cellule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cell",
      validate: {
        validator: function (value) {
          return this.role !== "chef_cellule" || Boolean(value);
        },
        message: "Un chef de cellule doit être rattaché à une cellule",
      },
    },
    photo: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("motDePasse")) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, SALT_ROUNDS);
  next();
});

userSchema.methods.comparePassword = function (motDePasseClair) {
  return bcrypt.compare(motDePasseClair, this.motDePasse);
};

export const User = mongoose.model("User", userSchema);
