import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),

  MONGO_URI: z.string().min(1, "MONGO_URI est requis"),

  JWT_SECRET: z.string().min(1, "JWT_SECRET est requis"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("aeroensem_token"),

  CLIENT_URL: z.string().default("http://localhost:5173"),

  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),

  EMAIL_HOST: z.string().optional().default(""),
  EMAIL_PORT: z.coerce.number().optional().default(587),
  EMAIL_USER: z.string().optional().default(""),
  EMAIL_PASSWORD: z.string().optional().default(""),
  EMAIL_FROM: z.string().optional().default("Club AéroENSEM <no-reply@aeroensem.ma>"),

  SEED_ADMIN_EMAIL: z.string().optional().default("admin@aeroensem.ma"),
  SEED_ADMIN_PASSWORD: z.string().optional().default("change-me-in-production"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variables d'environnement invalides :");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
