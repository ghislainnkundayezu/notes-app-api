import { StatusCodes } from "http-status-codes";
import { CustomError } from "../interfaces/errors";

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

export class ValidationError extends Error implements CustomError {
    statusCode: number;
    constructor(message: string) {
        super(message);
        this.name = "UnauthenticatedError";
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}