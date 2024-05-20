import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createUser, loginUser } from "./test-helpers";
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
            authToken = await loginUser(userId, userEmail);
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
                        expect(response.body).not.toEqual({
                            success: true,
                            message: "category successfully created.",
                        })
                    })
                })
        })

        describe("Update the label of the category", () => {
            let  categoryId: string;

                beforeEach(async () => {
                    categoryId = await createTestCategory(userId);
                    const category = await Category.find({_id: categoryId});
                    console.log(category)
                    console.log(authToken)
                });

                afterEach(async () => {
                    await mongoose.connection.dropDatabase();
                })
                   
            describe("Given that all the Input data is valid", () => {

                test("It should create a new category", async () => {
                    await request(server)
                                        .post(`/api/categories/${categoryId}`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"label": "newLabel"})
                                        .expect(StatusCodes.NO_CONTENT)
                    
                })
            })

            describe("Given that the category Id is invalid or doesn't exist", () => {
                test("It throw an error", async () => {
                    await request(server)
                                        .post(`/api/categories/ejkdjfjj32323`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"label": "label"})
                                        .expect(StatusCodes.BAD_REQUEST)
                    
                })
            })

            describe("Given that the new label is invalid", () => {
                let  categoryId: string;

                beforeAll(async () => {
                    categoryId = await createTestCategory(userId);
                });

                afterAll(async () => {
                    await mongoose.connection.dropDatabase();
                })

                test("It throw an error", async () => {
                    await request(server)
                                        .post(`/api/categories/${categoryId}`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"label": "Invalid Label"})
                                        .expect(StatusCodes.BAD_REQUEST)
                    
                })
            })
        })

        describe("Delete Category", () => {
            
            describe("Given that all the input is valid", () => {
                
                let  categoryId: string;

                beforeAll(async () => {
                    categoryId = await createTestCategory(userId);
                });

                afterAll(async () => {
                    await mongoose.connection.dropDatabase();
                })

                test("It deletes a category", async () => {
                    await request(server)
                                .delete(`/api/categories/${categoryId}`)
                                .set("Cookie", `auth-token=${authToken}`)
                                .send({"label": "label"})
                                .expect(StatusCodes.NO_CONTENT)
                    
                })
            })
            
               

            describe("Given that the category Id is invalid or doesn't exist", () => {
                test("It throw an error", async () => {
                    await request(server)
                                        .post(`/api/categories/664629fb5b2a203b0bb8084f`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"label": "label"})
                                        .expect(StatusCodes.BAD_REQUEST)
                    
                })
                
            })

        })

        describe("Get All Categories of a User", () => {
            
            describe("Given that the categories are found", () => {
                test("Return all the categories of user",  async () => {
                    const response = await request(server)
                                        .get(`/api/categories`)
                                        .set("Cookie", `auth-token=${authToken}`)
                                        .send({"label": "label"})
                                        .expect(StatusCodes.OK)
                    console.log(response.body)
                })
                
            })
            
            describe("Given that the categories are not found",  () => {
                test("It returns a not found error.", async () => {
                    
                    await request(server)
                        .get(`/api/categories`)
                        .set("Cookie", `auth-token=${authToken}`)
                        .expect(StatusCodes.NOT_FOUND)
                });
                
            })
            
        })
            
    })


    describe("Given that the User is not Logged in", () => {
        test("It should return an unauthenticated error", async () => {
            const response = await request(server)
                                .post("/api/categories")
                                .send({"label": "Important"})
                                .expect(StatusCodes.FORBIDDEN)   
            })
    })

})