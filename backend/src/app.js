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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// backend/src -> backend -> racine du monorepo -> frontend/dist
const frontendDist = path.resolve(__dirname, "../../frontend/dist");

export const app = express();

app.use(helmet());

// En production, frontend et backend sont servis depuis la même origine :
// pas besoin de CORS. Utile seulement pour le dev (Vite sur un autre port).
if (!isProd) {
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Sert le build React et lui laisse gérer toutes les routes non-API,
// pour que le déploiement Render n'ait qu'un seul service/domaine et
// que React Router fonctionne sur un rechargement d'URL profonde.
// Désactivé en dev : c'est Vite qui sert le frontend sur son propre port.
if (isProd) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);
