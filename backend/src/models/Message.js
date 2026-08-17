import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // nom/email optionnels au niveau schéma : le formulaire de contact les
    // exige (voir messageValidators.js), mais le widget de feedback rapide
    // (anonyme, un simple textarea) ne les demande pas.
    nom: { type: String, trim: true, default: "" },
    email: { type: String, lowercase: true, trim: true, default: "" },
    sujet: { type: String, required: true },
    contenu: { type: String, required: true },
    type: { type: String, enum: ["contact", "feedback"], default: "contact" },
    // Renseigné quand le feedback est envoyé depuis la modale d'un
    // événement précis (voir FeedbackWidget dans ExpandableEvents.jsx).
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
    lu: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ lu: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);
