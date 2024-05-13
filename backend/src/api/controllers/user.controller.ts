import { Request, Response } from "express";

import { User } from "../models";
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, HTTP_NO_CONTENT } from "../../config/constants";

export const getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId, userEmail } = req.user!;

        const user = await User.findOne({
            _id: userId,
            email: userEmail,
        })
        .select("-_id -password");

        if (!user) {
            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "User Not Found",
                error: null,
            });
        }

        return res.status(HTTP_NOT_FOUND).json({
            success: true,
            message: "User Found",
            error: null,
            data: user,
        });

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve user data",
            error: error.message,
        });
    }
}

export const updateUsername = async (req: Request, res: Response ): Promise<Response> => {
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

        if (user.matchedCount === 0) {
            return res.status(HTTP_NOT_FOUND).json({
                success: true,
                message: "User not found",
                error: null,
            });
        }

        if (user.modifiedCount === 0) throw new Error("No document was updated");

        return res.status(HTTP_NO_CONTENT).send();

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update the title of the note",
            error: error.message,
            
        });
    }
}