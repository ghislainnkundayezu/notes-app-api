import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/customErrors";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError(`Server Failed to return response: This route ${req.method.toUpperCase()}  ${req.originalUrl}  doesn't exist.`);

    next(error);
}