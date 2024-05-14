import { NextFunction, Request, Response } from "express";
import { CustomError } from "../interfaces/errors";
import { StatusCodes } from "http-status-codes";

const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    
    console.error(error);

    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "There is a problem with the server";
    const name = error.name || "Server Error";

    res.status(statusCode).json({
        success: false,
        error: name,
        message: message,
    });
}   



export default errorHandler;
