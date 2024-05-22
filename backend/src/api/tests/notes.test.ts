import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { StatusCodes } from "http-status-codes";

import server from "../../config/server";
import { createTestNote, createUser } from "./test-helpers";
import { generateToken } from "../helpers/jwt";


describe("Notes", () => {
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

        beforeEach( async () => {
            //await mongoose.connection.dropDatabase();
            const payload  = await createUser();
            const { userId: id, userEmail: email } = payload;
            userId = id;
            userEmail = email;
            authToken =  generateToken(payload)
        })
      
        afterEach( async () => {
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
                test("It should throw a Bad Request Error", async () => {
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
                
                describe("Given that the notes exist", () => {
                    let  noteId: string;

                    beforeEach(async () => {
                        noteId = await createTestNote(userId);
                    })

                    afterEach(async () => {
                       await mongoose.connection.dropDatabase();
                    })

                    test("It should return a note or notes", async () => {
                        const response = await request(server)
                                                .get(`/api/notes/${noteId}`)
                                                .set("Cookie", `auth-token=${authToken}`)
                                                .expect(StatusCodes.OK)
                    })

                })
                
                describe("Given that no notes exist based on a given filter", () => {
                    test("It should return a no content status code ", async () => {
                        const response = await request(server)
                                            .get("/api/notes")
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .expect(StatusCodes.NO_CONTENT)
                    })
                })
                
            })

            describe("Given that any input data is invalid", () => {
                test("It should return a bad request error ", async () => {
                    const response = await request(server)
                                        .get("/api/notes?labels=doesn't-exist")
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({})
                                        .expect(StatusCodes.BAD_REQUEST)
                    
                    expect(response.body).toHaveProperty("success")
                    expect(response.body["success"]).toBe(false)
                    expect(response.body["title"]).toEqual("ValidationError")
                })
            })
        })

        describe("Update the Data of a Note", () => {
            let  noteId: string;

            beforeEach(async () => {
                noteId = await createTestNote(userId);
            })

            afterEach(async () => {
                await mongoose.connection.dropDatabase();
            })

            describe("Given data all the input data is valid", () => {
                test("It should update the data of the note", async () => {
                    const response = await request(server)
                                            .patch(`/api/notes/${noteId}/title`)
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .send({"newValue": "Good Morning"})
                                            .expect(StatusCodes.OK)

                        expect(response.body).toHaveProperty("success")
                        expect(response.body["success"]).toBe(true)
                });
            });

            describe("Given data any of the input data is invalid", () => {
                test("It should throw an error", async () => {    
                    const response = await request(server)
                                            .patch(`/api/notes/${noteId}/title`)
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .send({"newValues": "Good Morning"})
                                            .expect(StatusCodes.BAD_REQUEST)

                        expect(response.body).toHaveProperty("success")
                        expect(response.body["success"]).toBe(false)
                });
            });
        })

        describe("Delete a Note", () => {
            let  noteId: string;

            beforeEach(async () => {
                noteId = await createTestNote(userId);
            });

            afterEach(async () => {
                await mongoose.connection.dropDatabase();
            });

            describe("Given that all the input is valid", () => {
                test("It deletes a category", async () => {
                    const response = await request(server)
                                .delete(`/api/notes/${noteId}`)
                                .set("Cookie", `auth-token=${authToken}`)
                                .expect(StatusCodes.NO_CONTENT)
                    
                })
            })         

            describe("Given that the category Id is invalid or doesn't exist", () => {
                test("It throw a validation error", async () => {
                    const response = await request(server)
                                        .delete(`/api/notes/664629fb5b2a203b0bb8084f`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .expect(StatusCodes.BAD_REQUEST)
                            
                            expect(response.body).toHaveProperty("success")
                            expect(response.body["success"]).toBe(false)
                            expect(response.body["title"]).toEqual("ValidationError")
                })
                
            })

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