import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env, isProd } from "./config/env.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import cellRoutes from "./routes/cell.routes.js";
import eventRoutes from "./routes/event.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import userRoutes from "./routes/user.routes.js";
import boardRoutes from "./routes/board.routes.js";
import partnerRoutes from "./routes/partner.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { contentRouter, statsRouter } from "./routes/content.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

export const app = express();

app.use(helmet());

// ATTENTION : Le CORS doit être activé en production car 
// le frontend (Vercel) et le backend (Render) n'ont pas la même URL.
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
// Limite relevée (défaut Express : 100kb) : logos/photos/dossiers PDF/
// vidéos produit voyagent en base64 dans le JSON de création/mise à jour.
// Portée à 20mb pour couvrir l'aperçu vidéo du Store (8 Mo bruts, ~10.7 Mo
// une fois encodés en base64 + le reste des champs du produit) — la limite
// naturelle reste de toute façon les 16 Mo par document MongoDB.
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

if (!isProd) {
  app.use(morgan("dev"));
}

app.get("/api/v1/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" }, message: null });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cells", cellRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/board", boardRoutes);
app.use("/api/v1/partners", partnerRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/dashboard", dashboardRoutes);

// On ne sert PLUS le frontend ici. 
// Vercel s'occupera d'héberger les fichiers React statiques de manière bien plus performante.

app.use(notFoundHandler);
app.use(errorHandler);