import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/jwt";
import { UnauthenticatedError } from "../errors/customErrors";

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
export const AuthenticateUser= async (req: Request, res: Response, next: NextFunction)  => {
    try {
        const token = req.cookies["auth-token"];

        if (!token) {
            throw new UnauthenticatedError("Unauthorized request: Missing authentication token");
        }
        const payload = verifyToken(token) as DecodedPayload;
        
        if(!payload.userId || !payload.userEmail) {
            throw new Error("Invalid Token");
        }

        req.user = payload;

        next();

    }catch(error) {
        next(error);
    }
}

