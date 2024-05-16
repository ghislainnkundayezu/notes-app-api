import jwt, { JwtPayload } from "jsonwebtoken";

import { JWT_SECRET } from "../../config/constants";

/**
 * function to generate a jsonwebtoken.
 * 
 * @param {JwtPayload} payload - contains data specific to a user.
 * @returns {string} - represents the token returned by the function.
 */
const generateToken = (payload: JwtPayload): string => { 
    try {
        const token = jwt.sign(
            payload, 
            JWT_SECRET!, 
            { expiresIn: "60m", }
        );

        return token;
       
    }catch {
        throw new Error("Failed to create jwt token");
    }
}

/**
 * Function to verify if the signature of the token.
 * 
 * @param token - represents a jsonwebtoken token.
 * @returns {JwtPayload} - returns the payload in the encoded in the token.
 */
const verifyToken = (token: string): JwtPayload => {
    try {
        
        const payload = jwt.verify(token, JWT_SECRET!) as JwtPayload;

        return payload;

    }catch {
        throw new Error("Failed to verify jwt token");
    }
}

export {
    generateToken,
    verifyToken,
}