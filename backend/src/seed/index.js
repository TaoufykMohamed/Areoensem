import { env } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import {
  User,
  Cell,
  Event,
  Registration,
  Application,
  BoardMember,
  Partner,
  Product,
  Order,
  GalleryItem,
  Message,
  SiteContent,
  Stat,
} from "../models/index.js";
import { slugify } from "../utils/slugify.js";
import {
  cellsData,
  eventsData,
  partnersData,
  productsData,
  boardMembersData,
  statsData,
  siteContentData,
} from "./data.js";

function toDate([year, month, day]) {
  return new Date(Date.UTC(year, month - 1, day));
}

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Cell.deleteMany({}),
    Event.deleteMany({}),
    Registration.deleteMany({}),
    Application.deleteMany({}),
    BoardMember.deleteMany({}),
    Partner.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    GalleryItem.deleteMany({}),
    Message.deleteMany({}),
    SiteContent.deleteMany({}),
    Stat.deleteMany({}),
  ]);
}

async function seedAdmin() {
  return User.create({
    nom: "Administrateur",
    email: env.SEED_ADMIN_EMAIL,
    motDePasse: env.SEED_ADMIN_PASSWORD,
    role: "admin",
    actif: true,
  });
}

async function seedCellsWithChefs() {
  const cellsByNom = new Map();

  for (const data of cellsData) {
    const { chefNom, ...cellFields } = data;

    const cell = await Cell.create(cellFields);

    const chef = await User.create({
      nom: chefNom,
      email: `chef.${cell.slug}@aeroensem.ma`,
      motDePasse: env.SEED_ADMIN_PASSWORD,
      role: "chef_cellule",
      cellule: cell._id,
      actif: true,
    });

    cell.chef = chef._id;
    await cell.save();

    cellsByNom.set(data.nomFr, cell);
  }

  return cellsByNom;
}

async function seedEvents(cellsByNom) {
  const events = eventsData.map(({ celluleNom, dateDebut, dateFin, ...rest }) => {
    const cell = cellsByNom.get(celluleNom);
    if (!cell) {
      throw new Error(`Cellule inconnue pour l'événement "${rest.titreFr}" : ${celluleNom}`);
    }
    return {
      ...rest,
      cellule: cell._id,
      dateDebut: toDate(dateDebut),
      dateFin: toDate(dateFin),
    };
  });

  return Event.insertMany(events);
}

async function main() {
  await connectDB();

  console.log("[seed] nettoyage des collections…");
  await clearCollections();

  console.log("[seed] création de l'administrateur…");
  const admin = await seedAdmin();

  console.log("[seed] création des cellules et de leurs chefs…");
  const cellsByNom = await seedCellsWithChefs();

  console.log("[seed] création des événements…");
  await seedEvents(cellsByNom);

  console.log("[seed] création des partenaires, produits, bureau, stats, contenu…");
  await Promise.all([
    Partner.insertMany(partnersData),
    Product.insertMany(productsData),
    BoardMember.insertMany(boardMembersData),
    Stat.insertMany(statsData),
    SiteContent.insertMany(siteContentData),
  ]);

  const chefs = await User.find({ role: "chef_cellule" }).select("email").lean();

  console.log("\n[seed] terminé ✅\n");
  console.log("Comptes de démonstration (mot de passe identique pour tous) :");
  console.log(`  mot de passe : ${env.SEED_ADMIN_PASSWORD}`);
  console.log(`  admin        : ${admin.email}`);
  chefs.forEach((c) => console.log(`  chef cellule : ${c.email}`));
}

main()
  .then(() => disconnectDB())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[seed] échec :", err);
    process.exit(1);
  });
