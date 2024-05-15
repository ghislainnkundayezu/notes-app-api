import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { CustomValidationError } from "../errors/customErrors";

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new CustomValidationError("Invalid Data", errors.array()); 
    }

    next();
}

export default validationHandler;