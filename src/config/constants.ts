import dotenv from "dotenv";
import { CookieOptions } from "express";
import os from "os";

dotenv.config();

// Environment Variables
const PORT: number = Number(process.env.PORT) || 3000;
const HOST_IP_ADDRESS: string = os.hostname()// process.env.HOST_IP_ADDRESS!;
const DATABASE_COLLECTION = process.env.DATABASE_COLLECTION;
const DATABASE_URL: string = process.env.DATABASE_URL!;
const JWT_SECRET = process.env.JWT_SECRET;

console.log("This is the name of the host IP Address", os.hostname())

// cookie options
const cookieDuration = 60 * 60 * 1000;   // 60 minutes.
const cookieOptions: CookieOptions  = {
  secure: true,
  httpOnly: true, 
  maxAge: cookieDuration,   
  sameSite: 'none',
}


export {
  PORT,
  HOST_IP_ADDRESS,
  DATABASE_COLLECTION,
  DATABASE_URL,
  JWT_SECRET,
  cookieOptions,
};