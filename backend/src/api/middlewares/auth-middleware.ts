import { NextFunction, Request, Response } from "express";
import { HTTP_UNAUTHORIZED } from "../../config/constants";
import { verifyToken } from "../helpers/jwt";

interface DecodedPayload extends Object {
    userId: string,
    userEmail: string,
}

declare module 'express' {
    interface Request {
        user?: DecodedPayload, 
    }
}


/**
 * 
 * 
 * @param {Request} req  
 * @param {Response}  res 
 * @param {NextFunction} next 
 * @returns 
 */
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction)  => {
    try {
        const token = req.cookies["auth-token"];

        if (!token) {
            return res.status(HTTP_UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized request: Missing authentication token",
                error: null,
            });
        }
        const payload = verifyToken(token) as DecodedPayload;
        
        if(!payload.userId || !payload.userEmail) {
            throw new Error("Invalid Token");
        }

        req.user = payload;

        next();

    }catch(error: any) {
        return res.status(HTTP_UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized request",
            error: error.message,
        });
    }
}
