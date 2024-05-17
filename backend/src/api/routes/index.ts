import authRoutes  from "./auth.routes"
import UserRoutes from "./user.routes"
import CategoryRoutes from "./category.routes"
import NoteRoutes from "./note.routes"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"

const welcomeMessage = (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
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
    });
}

export {
    authRoutes,
    UserRoutes,
    CategoryRoutes,
    NoteRoutes,  
    welcomeMessage,  
}