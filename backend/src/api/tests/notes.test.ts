import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { StatusCodes } from "http-status-codes";
import server from "../../config/server";
import { createUser } from "./test-helpers";
import { generateToken } from "../helpers/jwt";


describe.skip("Notes", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

    });

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })
    describe("Given that the User is logged in", () => {
        
        let authToken: string|undefined;
        let userId: string, userEmail: string

        beforeEach(async () => {
            const payload  = await createUser();
            const { userId: id, userEmail: email } = payload;
            userId = id;
            userEmail = email;
            authToken =  generateToken(payload) 
        })
      
        afterEach(async () => {
            await mongoose.connection.dropDatabase();
        })

        describe("Create a Note", () => {
            describe("Given that all the input data is valid", () => {
                test("It should create a note", async () => {
                    const response = await request(server)
                                            .post("/api/notes")
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .send({"title": "Important",})
                                            .expect(StatusCodes.CREATED)
                
                        expect(response.body).toEqual({
                            success: true,
                            message: "A note was successfully created.",
                        })
                })
            })

            describe("Given that any input data is invalid", () => {
                test.only("It should throw a Bad Request Error", async () => {
                    const response = await request(server)
                                            .post("/api/notes")
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .send({"titles": "Important",})
                                            .expect(StatusCodes.BAD_REQUEST)
                        expect(response.body).toHaveProperty("success")
                        expect(response.body["success"]).toBe(false)
                        expect(response.body["title"]).toEqual("ValidationError")
                })
            })

        })

        describe("Get Notes", () => {
            describe("Given that all the input data is valid", () => {
                test("It should create a note", async () => {
                    expect(1+1).toBe(2)
                })
            })

            describe("Given that any input data is invalid", () => {

            })
        })

        describe("Update the Data of a Note", () => {
            
        })

        describe("Delete a Note", () => {

        })
    })

    describe("Given that the User is not logged in", () => {
        test("It should return an unauthenticated error", async () => {
            const response = await request(server)
                                .post("/api/notes")
                                .send({"label": "Important"})
                                .expect(StatusCodes.UNAUTHORIZED)   
            })
    })
})