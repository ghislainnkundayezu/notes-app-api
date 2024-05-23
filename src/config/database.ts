import mongoose from "mongoose";
import { DATABASE_COLLECTION, DATABASE_URL } from "./constants";

/**
 * connects to the database.
 * @returns { Promise<typeof mongoose> } - returns a promise which resolves the  connection to the database.
 */
const db_connection = (): Promise<typeof mongoose> =>  {
    return new Promise((resolve, reject) => {
        
        mongoose.connect(DATABASE_URL, {
            dbName: DATABASE_COLLECTION
        })
        .then(connection => {
            resolve(connection);
        })
        .catch( error => {
            reject(error.message);
        });

    });
}

export default db_connection;