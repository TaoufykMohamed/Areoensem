import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env, isProd } from "./config/env.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!isProd) {
  app.use(morgan("dev"));
}

// Les routes par ressource (auth, cells, events, ...) sont montées ici
// au fur et à mesure de leur implémentation (étape 4).
app.get("/api/v1/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" }, message: null });
});

app.use(notFoundHandler);
app.use(errorHandler);
