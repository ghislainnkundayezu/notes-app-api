import { StatusCodes } from "http-status-codes";
import { CustomError } from "../interfaces/errors";
import { ValidationError } from "express-validator";

export class BadRequestError extends Error implements CustomError {
    
    public readonly statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export class NotFoundError extends Error implements CustomError {
    
    public readonly statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export class UnauthorizedError extends Error implements CustomError {
    
    public readonly statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

export class UnauthenticatedError extends Error implements CustomError {
    
    public readonly statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "UnauthenticatedError";
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export class CustomValidationError extends Error implements CustomError {
    
    public readonly statusCode: number;
    public readonly errors: ValidationError[];

    constructor(message: string, errors: ValidationError[]) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = StatusCodes.BAD_REQUEST;
        this.errors = errors;
    }
}