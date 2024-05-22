import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createUser } from "./test-helpers";
import server from "../../config/server";
import { StatusCodes } from "http-status-codes";
import { createTestCategory } from "./test-helpers";
import { Category } from "../models";
import { generateToken } from "../helpers/jwt";

describe("Categories", () => {
    
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

    });

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe("Given that the user is Logged in", () => {

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

        describe("Create Category", () => {    
                describe("Given that the label is valid", () => {
                    test("It should create a new category", async () => {
                        const response = await request(server)
                                            .post("/api/categories")
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .send({"label": "Important"})
                                            .expect(StatusCodes.CREATED)
                
                        expect(response.body).toEqual({
                            success: true,
                            message: "category successfully created.",
                        })
                    })
                })

                describe("Given that the label is invalid", () => {
                    test("It should throw a bad request error", async () => {
                        const response = await request(server)
                                            .post("/api/categories")
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .send({"label": "Invalid Label"})
                                            .expect(StatusCodes.BAD_REQUEST)

                        expect(response.body).toHaveProperty("success")
                        expect(response.body["success"]).toBe(false)
                        expect(response.body["title"]).toEqual("ValidationError")
                        
                    })
                })
        })

        describe("Update the label of the category", () => {
            let  categoryId: string;

            beforeEach(async () => {
                categoryId = await createTestCategory(userId);
                
            });

            afterEach(async () => {
                await mongoose.connection.dropDatabase();
            })
                   
            describe("Given that all the Input data is valid", () => {

                test("It should update the label of the category", async () => {
                    const response = await request(server)
                                        .patch(`/api/categories/${categoryId}`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"newLabel": "kudos"})
                                        .expect(StatusCodes.NO_CONTENT)
                   
                    
                })
            })

            describe("Given that the category Id is invalid or doesn't exist", () => {
                test("It throws a validation error", async () => {
                    const response = await request(server)
                                        .patch(`/api/categories/ejkdjfjj32323`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"newLabel": "kudos"})
                                        .expect(StatusCodes.BAD_REQUEST)
                        
                        expect(response.body).toHaveProperty("success")
                        expect(response.body["success"]).toBe(false)
                        expect(response.body["title"]).toEqual("ValidationError")
                    
                })
            })

            describe("Given that the new label is invalid", () => {

                test("It throw a validation error", async () => {
                    const response = await request(server)
                                        .patch(`/api/categories/${categoryId}`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"label": "Invalid Label"})
                                        .expect(StatusCodes.BAD_REQUEST)
                        expect(response.body).toHaveProperty("success")
                        expect(response.body["success"]).toBe(false)
                        expect(response.body["title"]).toEqual("ValidationError")
                    
                })
            })
        })

        describe("Delete Category", () => {
            let  categoryId: string;

            beforeEach(async () => {
                categoryId = await createTestCategory(userId);
            });

            afterEach(async () => {
                await mongoose.connection.dropDatabase();
            })

            describe("Given that all the input is valid", () => {
                test("It deletes a category", async () => {
                    const response = await request(server)
                                .delete(`/api/categories/${categoryId}`)
                                .set("Cookie", `auth-token=${authToken}`)
                                .expect(StatusCodes.NO_CONTENT)
                    
                })
            })
            
               

            describe("Given that the category Id is invalid or doesn't exist", () => {
                test("It throw a validation error", async () => {
                    const response = await request(server)
                                        .delete(`/api/categories/664629fb5b2a203b0bb8084f`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .expect(StatusCodes.BAD_REQUEST)
                            
                            expect(response.body).toHaveProperty("success")
                            expect(response.body["success"]).toBe(false)
                            expect(response.body["title"]).toEqual("ValidationError")
                })
                
            })

        })

        describe("Get All Categories of a User", () => {

            describe("Given that the categories are found", () => {
                let  categoryId: string;

                beforeEach(async () => {
                    categoryId = await createTestCategory(userId);
                });
    
                afterEach(async () => {
                    await mongoose.connection.dropDatabase();
                });

                test("Return all the categories of user",  async () => {
                    const response = await request(server)
                                        .get(`/api/categories`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"label": "label"})
                                        .expect(StatusCodes.OK)
                })
            })
            
            describe("Given that the categories are not found",  () => {
                test("It returns a not found error.", async () => {  
                    const response = await request(server)
                                            .get(`/api/categories`)
                                            .set("Cookie", `auth-token=${authToken}`)
                                            .expect(StatusCodes.NOT_FOUND)

                        expect(response.body).toHaveProperty("success")
                        expect(response.body["success"]).toBe(false)
                        expect(response.body["title"]).toEqual("NotFoundError")
                });
                
            })
            
        })
            
    })


    describe("Given that the User is not Logged in", () => {
        test("It should return an unauthenticated error", async () => {
            const response = await request(server)
                                .post("/api/categories")
                                .send({"label": "Important"})
                                .expect(StatusCodes.UNAUTHORIZED)   

                expect(response.body).toHaveProperty("success")
                expect(response.body["success"]).toBe(false)
                expect(response.body["title"]).toEqual("UnauthenticatedError")
            })
    })

})

