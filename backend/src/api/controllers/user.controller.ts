import { Request, Response } from "express";
import bcrypt from "bcrypt";


import { Category, Note, User } from "../models";
import { HTTP_BAD_REQUEST, HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, HTTP_OK, HTTP_UNAUTHORIZED } from "../../config/constants";
import { generateToken } from "../helpers/jwt";

/**
 * Controller function to handle user registration.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing request object.
 * @returns { Promise<Response> } - A promise that resolves with the response object.
 */
const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "Incomplete Data",
                null: null,
            });
        }

        // checking if the email exists.
        const emailExists = await User.findOne({ email: email })

        if ( emailExists ) {
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "Email Exists",
                null: null,
            });
        }
        
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

        return res.status(HTTP_CREATED).json({
            success: true,
            message: "User Registered",
            error: null,
        });

    }catch(error: any) {
        return res.status(HTTP_UNAUTHORIZED).json({
            success: false,
            message: "Failed to Register User",
            error: error.message,
        });
    }
}

/**
 * Controller function to handle user login.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing response object.
 * @returns { Promise<Response> } -A promise that resolves with the response object.
 */
const loginUser = async (req: Request, res: Response): Promise<Response> => {
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

        if (!user || !passwordsMatch) {
            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "User Not Found",
                error: null,
            });
        }


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


        return res.status(HTTP_OK).json({
            success: true,
            message: "User login succeeded",
            error: null,
        });

    }catch(error: any) {
        return res.status(HTTP_UNAUTHORIZED).json({
            success: false,
            message: "User Login Failed",
            errro: error.message,
        });
    }
}

/**
 * Controller function to handle user logout.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing response object.
 * @returns { Promise<Response> } -A promise that resolves with the response object.
 */
const logoutUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        
        return res.clearCookie("auth-token");

    }catch(error: any) {
        return res.status(HTTP_UNAUTHORIZED).json({
            success: false,
            message: "User Logout Failed",
            error: error.message,
        });
    }
}

/**
 * Controller function to fetch notes of user from the database.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing response object.
 * @returns { Promise<Response> } -A promise that resolves with the response object.
 */
const getNotes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId } = req.user;

        const notes = await Note.find({ owner: userId })
                                    .select("title details createAt -_id -owner")
                                    .populate({
                                        path: 'category',
                                        select: "title -_id"
                                    });

        if (notes.length === 0) {

            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "No notes found",
                data: notes,
                error: null,
            });
        }

        return res.status(HTTP_OK).json({
            success: true,
            data: notes,
            message: "Notes successfully retrieved",
            error: null,
        });

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve notes",
            data: null,
            error: error.message,
        });
    }
}

/**
 * Controller function to fetch notes of a user by category from the database.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing response object.
 * @returns { Promise<Response> } -A promise that resolves with the response object.
 */
const getNotesByCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId, userEmail } = req.user;
        const category = req.query;

        const notes = await Category.find({
                            owner: userId,
                            label: category,
                        })
                        .populate({
                            path: "notes",
                            select: "-owner",
                            populate: {
                                path: 'category',
                                select: "title -_id",
                            }
                        });
                       
        // CASE STUDY: 
        const notes2 = await Note.find({ 
                            owner: userId,
                            })
                            .populate({
                                path: "category",
                                select: "title -_id",
                                populate: {
                                    path: 'category',
                                    select: "title -_id",
                                }  
                            })


        if (notes.length === 0) {

            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "No notes found",
                data: notes,
                error: null,
            });
        }

        return res.status(HTTP_OK).json({
            success: true,
            data: notes,
            message: "Notes successfully retrieved",
            error: null,
        });

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve notes",
            data: null,
            error: error.message,
        });
    }
}