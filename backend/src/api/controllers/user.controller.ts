import { NextFunction, Request, Response } from "express";

import { User } from "../models";
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_NO_CONTENT } from "../../config/constants";
import { NotFoundError } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId, userEmail } = req.user!;

        const user = await User.findOne({
            _id: userId,
            email: userEmail,
        })
        .select("-_id -password");

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

export const updateUsername = async (req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
    try {
        const { userId } = req.user!;

        const { newUsername } = req.body;

        if(!newUsername) {
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "A new username is required",
                error: null,
            });
        }

        const user = await User.updateOne(
            { _id: userId },
            { $set: {username: newUsername } }
        );

        if (user.matchedCount === 0) throw new NotFoundError("User Not Found.");

        if (user.modifiedCount === 0) throw new Error("No document was updated");

        return res.status(StatusCodes.NO_CONTENT).send();

    }catch(error) {

        next(error);

    }
}