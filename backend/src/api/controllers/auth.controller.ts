import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";


import { User } from "../models";
import { HTTP_BAD_REQUEST, HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, HTTP_OK, HTTP_UNAUTHORIZED } from "../../config/constants";
import { generateToken } from "../helpers/jwt";
import { BadRequestError, NotFoundError } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";

/**
 * Controller function to handle user registration.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing request object.
 * @returns { Promise<Response> } - A promise that resolves with the response object.
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {

        const { username, email, password } = req.body;

        // TODO: Remember to add validation.
        if (!username || !email || !password) {
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "Incomplete Data",
                null: null,
            });
        }

        //TODO: Remember to remove it.
        const emailExists = await User.findOne({ email: email })

        if (emailExists) throw new BadRequestError("Email Exists");
        
        const newUser = new User({
            username: username,
            email: email,
            password: password,
        });
        
        await newUser.save();


        const token = generateToken({
            userId: newUser._id,
            userEmail: newUser.email,
        });

        res.cookie("auth-token", token, {
            secure: true,
            httpOnly: true, 
			maxAge: 300000, 
			sameSite: 'none',
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User Registered",
            error: null,
        });

    }catch(error) {

        next(error);
    }
}

/**
 * Controller function to handle user login.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing response object.
 * @returns { Promise<Response> } -A promise that resolves with the response object.
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {

        const { username, email, password } = req.body;

        if(!username || !email || !password) { 
            
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "Incomplere Data",
                error: null,
            });
        }

        const user = await User.findOne({ 
            username: username,
            email: email,
        });

        const passwordsMatch= user && await bcrypt.compare(password, user.password);

        if (!user) throw new NotFoundError("User Not Found.");

        if (!passwordsMatch) throw new BadRequestError("Passwords don't match.")
        


        const token = generateToken({
            userId: user._id,
            userEmail: user.email,
        });

        res.cookie("auth-token", token, {
            secure: true,
            httpOnly: true, 
			maxAge: 300000, 
			sameSite: 'none',
        });


        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User login succeeded",
            error: null,
        });

    }catch(error) {

        next(error);

    }
}

/**
 * Controller function to handle user logout.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing response object.
 * @returns { Promise<Response> } -A promise that resolves with the response object.
 */
export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void>  => {
    try {

        return res.status(StatusCodes.OK).clearCookie("auth-token");

    }catch(error) {

        next(error);
    }
}




