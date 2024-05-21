import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose"
import server from "../../config/server"
import { createUser } from "./test-helpers"
import { generateToken } from "../helpers/jwt"


const testUserData = {
    username: "test",
    email: "test@example.com",
}



describe.skip("Users", () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

    });

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })


    describe("GET /api/users", () => {
        describe("Given that the user is logged in", () => {
            let authToken: string;
            beforeAll(async () => {
                const payload  = await createUser();
                authToken = generateToken(payload)
            })
            afterAll(async () => {
                await mongoose.connection.dropDatabase();
            })

            // @ts-ignore
            it("Responds with a json message", async () => {
                const response = await request(server)
                                        .get("/api/users")
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .expect(StatusCodes.OK)
                                        .expect("Content-Type", /json/)
                
                expect(response.body).toEqual({"data": {...testUserData}, "message": "User Found", "success": true})
            }) 
        })

        describe("Given that the user is not logged in", () => {
            it("Responds with a json message", async () => {
                const response = await request(server)
                                        .get("/api/users")
                                        .expect(StatusCodes.UNAUTHORIZED)
            })
        })

          
    })

    describe("PATCH /api/users", () => {
    
        describe("Given that the user is logged in", () => {
            let authToken: string;
            beforeAll(async () => {
                const payload  = await createUser();
                authToken = generateToken(payload)
            })
            afterAll(async () => {
                await mongoose.connection.dropDatabase();
            })

            describe("Given that the new username is valid", () => {
                it("Responds with a json message", async () => {
                    const response = await request(server)
                                        .patch("/api/users")
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"username": "tests"})
                                        .expect(StatusCodes.NO_CONTENT)
                })
            })

            describe("Given that the new username isnot valid", () => {
                it("Responds with an error", async () => {
                    const response = await request(server)
                                        .patch("/api/users")
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"username": "invalid username"})
                                        .expect(StatusCodes.BAD_REQUEST)
                })
            })
        })

        describe("Given that the user is not logged in", () => {
            test("Responds with an error message", async () => {
                    const response = await request(server)
                                            .patch("/api/users")
                                            .send({"username": "good"})
                                            .expect(StatusCodes.UNAUTHORIZED)
            })

        })
    })

})
