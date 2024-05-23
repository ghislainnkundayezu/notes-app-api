import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose"
import server from "../src/config/server"
import { createUser } from "./test-helpers"
import { generateToken } from "../src/api/helpers/jwt"


const testUserData = {
    username: "test",
    email: "test@example.com",
}



describe("Users", () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe("Given that the user is logged in", () => {
        let authToken: string;
        
        beforeEach(async () => {
            const payload  = await createUser();
            authToken = generateToken(payload)
        });

        afterEach(async () => {
            await mongoose.connection.dropDatabase();
        });

        describe("GET /api/users", () => {

            test("it should respond with a json message", async () => {
                const response = await request(server)
                                        .get("/api/users")
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .expect(StatusCodes.OK)
                                        .expect("Content-Type", /json/)
                
                expect(response.body).toEqual({
                    "data": {...testUserData}, 
                    "message": "User Found", 
                    "success": true
                });
            }); 
        });

       
        describe("PATCH /api/users", () => {
                describe("Given that the new username is valid", () => {
                    test("Responds with a json message", async () => {
                        const response = await request(server)
                                            .patch("/api/users")
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .send({"username": "tests"})
                                            .expect(StatusCodes.NO_CONTENT)
                    })
                })
    
                describe("Given that the new username isnot valid", () => {
                    test("Responds with an error", async () => {
                        const response = await request(server)
                                            .patch("/api/users")
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .send({"username": "invalid username"})
                                            .expect(StatusCodes.BAD_REQUEST)
                    })
                })
        });   
    });

    describe("Given that the user is not logged in", () => {
        test("Responds with an error message", async () => {
                const response = await request(server)
                                        .get("/api/users")
                                        .expect(StatusCodes.UNAUTHORIZED)
                    
                expect(response.body).toHaveProperty("success")
                expect(response.body["success"]).toBe(false)
                expect(response.body["title"]).toEqual("UnauthenticatedError")
        });
    });
});

