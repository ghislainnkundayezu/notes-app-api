import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import { AuthenticateUser, notFoundHandler, errorHandler } from "../api/middlewares";
import { welcomeMessage, authRoutes, UserRoutes, NoteRoutes, CategoryRoutes } from "../api/routes";

const server: Express = express();   // create an instance of the Express application.

server.use(express.json());     // configure the server to parse JSON data in incomming requests.
server.use(cors());             // configure cross-origin resource sharing for all routes.
server.use(cookieParser());     // configure the server to parse cookies  in incomming requests.


server.get("/", welcomeMessage);
server.get("/api", welcomeMessage);

// Routes.
server.use("/api/auth", authRoutes);

server.use("/api/users", AuthenticateUser, UserRoutes);

server.use("/api/notes", AuthenticateUser, NoteRoutes);

server.use("/api/categories", AuthenticateUser, CategoryRoutes);



//middleware to handle unexisting routes.
server.use(notFoundHandler)

// middle ware to handle errors.
server.use(errorHandler);


export default server;