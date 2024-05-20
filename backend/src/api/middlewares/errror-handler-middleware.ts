import { NextFunction, Request, Response } from "express";
import { CustomError } from "../interfaces/errors";
import { StatusCodes } from "http-status-codes";

/**
 * 
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    
    //console.error(error);
    
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "There is a problem with the server";
    const name = error.name || "Server Error";
    const errors = (error.name === "ValidationError") ? error.errors : null;
    

    res.status(statusCode).json({
        success: false,
        title: name,
        description: message,
        details: errors,
    });
}   



export default errorHandler;
