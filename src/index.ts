import server from "./config/server";
import db_connection from "./config/database";
import { HOST_IP_ADDRESS, PORT } from "./config/constants";


// connection to the database.
db_connection()
    .then(res => {
        console.log("Database Started...");
        
        // initialise the server.
        server.listen(PORT, HOST_IP_ADDRESS, () => {
            console.log(`Server started listening at port ${PORT}...`);
        });
    })
    .catch(error => {
        console.log(error);
    });
