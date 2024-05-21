import { StatusCodes } from "http-status-codes"
import server from "../../config/server"
import request from "supertest"

const welcomeMessage = {
    "name": "My API",
    "version": "v1",
    "description": "This API provides access to the notes created by users.",
    "resources": [
        "/api/auth",
        "api/users",
        "/api/notes",
        "/api/categories",
    ],
    "status": "ok",
}

describe.skip("", () => {
    
    describe("GET /", () => {
    
        it("Responds with a json message", async () => {
            const response = await request(server)
                .get("/")
                .expect(StatusCodes.OK)
                .expect("Content-Type", /json/)
            expect(response.body).toEqual(welcomeMessage)
        })
    })

    describe("GET /api", () => {
        it("Responds with a json message", async () => {
            const response = await request(server)
                .get("/api")
                .expect(StatusCodes.OK)
                .expect("Content-Type", /json/)
            expect(response.body).toEqual(welcomeMessage)
        })
    })

    describe("GET /what-the-hell", () => {
        it("respondes with a notFound Error", async () => {
            const response = await request(server)
                .get("/api")
                .expect(StatusCodes.OK)
                .expect("Content-Type", /json/)
            expect(response.body).toEqual(welcomeMessage)
        })
    })

})