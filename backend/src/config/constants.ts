import dotenv from "dotenv";
import { CookieOptions } from "express";

dotenv.config();

// Environment Variables
const PORT = process.env.PORT || 3000;
const DATABASE_COLLECTION = process.env.DATABASE_COLLECTION;
const DATABASE_URL: string = process.env.DATABASE_URL!;
const JWT_SECRET = process.env.JWT_SECRET;

const cookieDuration = 20 * 60 * 1000;
const cookieOptions: CookieOptions  = {
  secure: true,
  httpOnly: true, 
  maxAge: cookieDuration,   
  sameSite: 'none',
}





export {
  PORT,
  DATABASE_COLLECTION,
  DATABASE_URL,
  JWT_SECRET,
  cookieOptions,
};