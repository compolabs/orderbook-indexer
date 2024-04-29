import path from "path";
import { config } from "dotenv";
import {loadVar} from "./utils/loadVar";

config({ path: path.join(__dirname, "../.env") });

export const PORT = loadVar("PORT", true);
export const DB_NAME = loadVar("DB_NAME");
export const DB_USER = loadVar("DB_USER");
export const DB_PASSWORD = loadVar("DB_PASSWORD");
export const DB_HOST = loadVar("DB_HOST");
export const PRIVATE_KEY = loadVar("PRIVATE_KEY");
export const ORDERBOOK_ID = loadVar("ORDERBOOK_ID");
export const CLEARING_HOUSE_ID = loadVar("CLEARING_HOUSE_ID");
export const ACCOUNT_BALANCE_ID = loadVar("ACCOUNT_BALANCE_ID");
export const PERP_MARKET_ID = loadVar("PERP_MARKET_ID");
export const START_BLOCK = loadVar("START_BLOCK");
