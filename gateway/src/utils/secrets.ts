import { config } from "dotenv";
import { resolve } from "path";

export const NODE_ENV = process.env.NODE_ENV || "DEV";

config({ path: resolve(__dirname, `../../env.${NODE_ENV}`) });

export const PORT = process.env.PORT || 3000;
export const LOG_LEVEL = process.env.LOG_LEVEL || "debug";
export const DB_HOST = process.env.DB_HOST || "";
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
export const DB_NAME = process.env.DB_NAME || "gateway";
export const ACCESSTOKEN_SECRET = process.env.ACCESSTOKEN_SECRET || "";
export const REFRESHTOKEN_SECRET = process.env.REFRESHTOKEN_SECRET || "";
export const API_TOKEN_PRIVATEKEY = process.env.API_TOKEN_PRIVATEKEY || "";
export const API_TOKEN_PUBLICKEY = process.env.API_TOKEN_PUBLICKEY || "";
