import server from "./config/server";
import db_connection from "./config/database";
import { PORT } from "./config/constants";


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
