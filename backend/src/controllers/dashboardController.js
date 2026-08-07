import { Cell, Event, Application, Message, Order, User, GalleryItem, Registration } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  if (req.user.role === "admin") {
    const [cellules, aVenir, enCours, passes, candidaturesEnAttente, messagesNonLus, commandesEnAttente, utilisateurs] =
      await Promise.all([
        Cell.countDocuments(),
        Event.countDocuments(Event.statutFilter("a_venir")),
        Event.countDocuments(Event.statutFilter("en_cours")),
        Event.countDocuments(Event.statutFilter("passe")),
        Application.countDocuments({ statut: "en_attente" }),
        Message.countDocuments({ lu: false }),
        Order.countDocuments({ statut: "en_attente" }),
        User.countDocuments(),
      ]);

    return res.json({
      success: true,
      data: {
        cellules,
        evenements: { aVenir, enCours, passes },
        candidaturesEnAttente,
        messagesNonLus,
        commandesEnAttente,
        utilisateurs,
      },
      message: null,
    });
  }

  // chef_cellule : périmètre limité à sa propre cellule
  const celluleId = req.user.cellule;
  const eventIds = await Event.find({ cellule: celluleId }).distinct("_id");
  const [evenements, inscriptions, galerie] = await Promise.all([
    Event.countDocuments({ cellule: celluleId }),
    Registration.countDocuments({ event: { $in: eventIds } }),
    GalleryItem.countDocuments({ cellule: celluleId }),
  ]);

  res.json({ success: true, data: { evenements, inscriptions, galerie }, message: null });
});
