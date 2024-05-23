import { ValidationError } from "express-validator";

export interface CustomError extends Error {
    statusCode: number,
    name: string,
    errors?: ValidationError[],
}
