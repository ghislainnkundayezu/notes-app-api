import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import db_connection from "./config/database";
import { PORT } from "./config/constants";
import { CategoryRoutes, NoteRoutes, UserRoutes, authRoutes, welcomeMessage } from "./api/routes";
import { AuthenticateUser, errorHandler, notFoundHandler } from "./api/middlewares";
import { StatusCodes } from "http-status-codes";


export const server: Express = express();   // create an instance of the Express application.

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


// connection to the database.
// db_connection()
//     .then(res => {
//         console.log("Database Started...");

//         // initialise the server.
//         server.listen(PORT, () => {
//             console.log(`Server started listening at port ${PORT}...`);
//         });
//     })
//     .catch(error => {
//         console.log(error);
//     });
