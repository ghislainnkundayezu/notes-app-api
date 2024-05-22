import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server";

import server from "../../config/server"
import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose";


const userData = {
    username: "ghislain",
    email: "gm@gmail.com",
    password: "good123tests",
}

const registrationSuccessMessage = {
    success: true,
    message: "User Registered",
}

const loginSuccessMessage = {
    success: true,
    message: "User Login Succeeded",
}

describe("User Authentication", () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri())
    }); 

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    });
    

    describe("User Registration", () => {
        describe("Given that the Data in valid", () => {
            test("Responds with a success message", async () => {
                const response = await request(server)
                                        .post("/api/auth/register")
                                        .send(userData)
                                        .expect(StatusCodes.CREATED)
                                        .expect("Content-Type", /json/)
                
                                       
                expect(response.header).toHaveProperty("set-cookie");
                // @ts-ignore
                const authTokenCookie = response.header['set-cookie'].find(cookie => cookie.includes("auth-token"));

                expect(authTokenCookie).toBeTruthy();
                        

                expect(response.body).toEqual(registrationSuccessMessage)
            })
        })

        describe("Given that the data is invalid", () => {
            test("Responds with an error message", async () => {
                const response = await request(server)
                                        .post("/api/auth/register")
                                        .send({...userData, password: "gofs"})
                                        .expect(StatusCodes.BAD_REQUEST)
                                        .expect("Content-Type", /json/)
                expect(response.body).not.toEqual(registrationSuccessMessage)
            })
        })
        
    })
    describe("User Login", () => {
        describe("Given that the user exists", () => {
            test("Responds with a success message", async () => {
                const response = await request(server)
                                        .post("/api/auth/login")
                                        .send(userData)
                                        .expect(StatusCodes.OK)
                                        .expect("Content-Type", /json/)
                                       
                expect(response.header).toHaveProperty("set-cookie");
                // @ts-ignore
                const authTokenCookie = response.header['set-cookie'].find(cookie => cookie.includes("auth-token"));

                expect(authTokenCookie).toBeTruthy();


                expect(response.body).toEqual(loginSuccessMessage)                       
            })
        })

        describe("Given that the user doesn't exist", () => {
            test("Responds with a not found error", async () => {
                const response = await request(server)
                                        .post("/api/auth/login")
                                        .send({...userData, username: "fils"})
                                        .expect(StatusCodes.NOT_FOUND)
                                        .expect("Content-Type", /json/)

                expect(response.body).not.toEqual(loginSuccessMessage)  
            })
        })

        describe("Given that the passowords don't match", () => {
            test("Responds with a Bad Request Error", async () => {
                const response = await request(server)   
                                        .post("/api/auth/login")
                                        .send({...userData, password: "new"})
                                        .expect(StatusCodes.BAD_REQUEST)
                                        .expect("Content-Type", /json/)

                expect(response.body).not.toEqual(loginSuccessMessage)  
            })
        })

        describe("Given that the Input data is invalid", () => {
            test("Responds with an error messsage", async () => {
                const response = await request(server)
                                        .post("/api/auth/login")
                                        .send({...userData, password: "new"})
                                        .expect(StatusCodes.BAD_REQUEST)
                                        .expect("Content-Type", /json/)
                expect(response.body).not.toEqual(loginSuccessMessage)
            })    
        })
    })

    describe("User Logout", () => {
        describe("Given that user logout is successful", () => {
            test("It return no content status", async () => {
                const response = await request(server)
                                        .post("/api/auth/logout")
                                        .expect(StatusCodes.NO_CONTENT)
                                      
                expect(response.header).toHaveProperty('set-cookie');
                const cookies = response.header['set-cookie'];

                // @ts-ignore
                expect(cookies.some(cookie => cookie.includes("auth-token=;"))).toBe(true);
            })
        })
        
    })

})
    

