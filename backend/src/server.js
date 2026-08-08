import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function main() {
  // 1. On démarre d'abord le serveur pour satisfaire Render immédiatement
  // On s'assure d'utiliser le port fourni par Render, ou 5000 par défaut
  const PORT = process.env.PORT || env.PORT || 5000;
  
  // L'ajout de "0.0.0.0" est vital pour que Render détecte l'ouverture du port
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] AéroENSEM API écoute sur le port ${PORT}`);
  });

  // 2. On tente la connexion à la base de données ensuite
  try {
    await connectDB();
    console.log("[server] Connexion à MongoDB réussie !");
  } catch (dbError) {
    console.error("[server] Échec de la connexion MongoDB :", dbError);
    // On ne fait PAS de process.exit(1) ici pour ne pas crasher le serveur Render
    // L'API sera en ligne, même si la base de données est injoignable temporairement
  }
}

main().catch((err) => {
  console.error("[server] Erreur critique :", err);
})