import { NextFunction, Request, Response } from "express";

import { User } from "../models";
import { NotFoundError } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";

/**
 * Function to retrieve info about the user.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId, userEmail } = req.user!;

        const user = await User.findOne({
            _id: userId,
            email: userEmail,
        })
        .select("-_id -password -__v");

        if (!user) throw new NotFoundError("User Not Found");
            

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User Found",
            data: user,
        });

    }catch(error) {

        next(error);
    }
}

/**
 * Function to update the username of User.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const updateUsername = async (req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
    try {
        const { userId } = req.user!;

        const { newUsername } = req.body;

        const user = await User.updateOne(
            { _id: userId },
            { $set: {username: newUsername } }
        );
        
        if (!user.acknowledged) throw new Error("The database sever failed to acknowledge the change.");

        if (user.matchedCount === 0) throw new NotFoundError("User Not Found.");

        if (user.modifiedCount === 0) throw new Error("No document was updated");
        
        return res.status(StatusCodes.NO_CONTENT).send();

    }catch(error) {

        next(error);

    }
}