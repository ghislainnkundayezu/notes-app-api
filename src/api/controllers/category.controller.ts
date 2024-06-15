import { NextFunction, Request, Response } from "express";

import { Category, Note } from "../models";
import { NotFoundError } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";


/**
 * Function to create a new category document or record in the database.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    
    try {    

        const { userId } = req.user!;
        const { label } = req.body;


        const newCategory = new Category({ 
            label: label, 
            owner: userId 
        });
        await newCategory.save();

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "category successfully created.",
        });

    }catch(error) {

        next(error);
    }

}



/**
 * Function to update the label of an existing category document or record in the database.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const updateCategoryLabel = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.user!;
        const { categoryId } = req.params!;
        const {  newLabel } = req.body;
        
        const category = await Category.updateOne(
            { _id: categoryId, owner: userId },
            { $set: { label: newLabel } }
        );
     
        if (category.modifiedCount === 0) {
            throw new Error("Failed to update the label");
        }
        

        return res.status(StatusCodes.NO_CONTENT).send();

    }catch(error) {
        next(error);
    }
}



/**
 * Function to delete a category document or record from the database.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    
    try {
        const { userId } = req.user!;

        const { categoryId } = req.params;

        // let's first remove the category from the notes.
        await Note.updateMany(
            { owner: userId, category: categoryId },
            { $set: { category: null } },
        );

        await Category.deleteOne({ 
            _id: categoryId,
            owner: userId,
        });
        
        return res.status(StatusCodes.NO_CONTENT).send();

        
    
    }catch(error) {
        
        next(error);;
    }
}



/**
 * Function to get category documents or records of a particular owner or userId in the database.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.user!;

        const categories = await Category.find({ owner: userId });
                                        
        if (categories.length === 0) {
            throw new NotFoundError("No categories Found");
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            data: categories,
            message: "categories successfully retrieved",
        });

    }catch(error) {
        next(error);   
    }
}

