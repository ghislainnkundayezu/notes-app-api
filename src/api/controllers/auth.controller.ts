import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";


import { User } from "../models";
import { generateToken } from "../helpers/jwt";
import { BadRequestError, NotFoundError } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";
import { cookieOptions } from "../../config/constants";

/**
 * Controller function to handle user registration.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware.
 * @returns { Promise<Response | void> } - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {

        const { username, email, password } = req.body;

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

        res.cookie("auth-token", token, cookieOptions);

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User Registered",
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
 * @param {NextFunction} next - function to pass control to the next middleware.
 * @returns { Promise<Response | void> } - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {

        const { username, email, password } = req.body;

        const user = await User.findOne({ 
            username: username,
            email: email,
        });

        if (!user) throw new NotFoundError("User Not Found.");
        
        const passwordsMatch= await bcrypt.compare(password, user.password);
 
        if (!passwordsMatch) throw new BadRequestError("Passwords don't match.")
        


        const token = generateToken({
            userId: user._id,
            userEmail: user.email,
        });

        res.cookie("auth-token", token, cookieOptions);


        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User Login Succeeded",
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
 * @param {NextFunction} next - function to pass control to the next middleware.
 * @returns { Promise<Response | void> } - Returns a promise that resolves with the response object or passes control to the next middleware. */
export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void>  => {
    try {
        
        res.clearCookie("auth-token");
        return res.status(StatusCodes.NO_CONTENT).send();

    }catch(error) {

        next(error);
    }
}




