import dotenv from "dotenv";

dotenv.config();

// Environment Variables
const PORT = process.env.PORT || 3000;
const DATABASE_COLLECTION = process.env.DATABASE_COLLECTION;
const DATABASE_URL: string = process.env.DATABASE_URL!;
const JWT_SECRET = process.env.JWT_SECRET;



// HTTP Status Codes
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;




export {
  PORT,
  DATABASE_COLLECTION,
  DATABASE_URL,
  JWT_SECRET,
  HTTP_OK,
  HTTP_CREATED,
  HTTP_NO_CONTENT,
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
  HTTP_FORBIDDEN,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
};