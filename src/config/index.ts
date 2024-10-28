import dotenv from "dotenv";
import { Config } from "@interfaces/config.interface";

const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envPath });

const config: Config = {
  app: {
    port: process.env.PORT ? parseInt(process.env.PORT!, 10) : 3000,
    jwtSecret: process.env.SECRET_KEY!,
    node_env: process.env.NODE_ENV!,
  },
  cors: {
    origin: process.env.CORS_ORIGIN!,
    credentials: Boolean(process.env.CORS_CREDENTIALS!),
  },
  logs: {
    format: process.env.LOG_FORMAT!,
    directory: process.env.LOG_DIR!,
  },
  cloudinary: {
    api_key: process.env.API_KEY!,
    api_secret: process.env.API_SECRET!,
    cloud_name: process.env.CLOUD_NAME!,
    folder: process.env.FOLDER!
  },
};

export default config;
