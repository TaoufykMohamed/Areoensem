import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function main() {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`[server] AéroENSEM API sur http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("[server] échec du démarrage :", err);
  process.exit(1);
});
