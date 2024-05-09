import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import db_connection from "./config/database";
import { PORT } from "./config/constants";


const server: Express = express();   // create an instance of the Express application.

server.use(express.json());     // configure the server to parse JSON data in incomming requests.
server.use(cors());             // configure cross-origin resource sharing for all routes.
server.use(cookieParser());     // configure the server to parse cookies  in incomming requests.


// connection to the database.
db_connection()
    .then(res => {
        console.log("Database Started...");

        // initialise the server.
        server.listen(PORT, () => {
            console.log(`Server started listening at port ${PORT}...`);
        });
    })
    .catch(error => {
        console.log(error);
    });
