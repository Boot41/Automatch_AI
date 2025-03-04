import dotenv from "dotenv";

dotenv.config({path:".env"});

export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const SERP_API_KEY = process.env.SERP_API_KEY;