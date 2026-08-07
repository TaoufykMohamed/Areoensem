import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("strictQuery", true);

export async function connectDB() {
  mongoose.connection.on("error", (err) => {
    console.error("[mongo] erreur de connexion :", err.message);
  });

  await mongoose.connect(env.MONGO_URI);
  console.log(`[mongo] connecté → ${mongoose.connection.name}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
