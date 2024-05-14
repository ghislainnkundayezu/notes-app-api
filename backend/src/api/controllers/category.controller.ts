import { NextFunction, Request, Response } from "express";

import { Category, Note } from "../models";
import { HTTP_BAD_REQUEST, HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, HTTP_NO_CONTENT, HTTP_OK } from "../../config/constants";
import { NotFoundError } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";

/**
 * 
 */
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    
    try {    

        const { userId } = req.user!;
        const { categoryLabel } = req.body;

        //TODO: remember to add validation
        if (!categoryLabel) {
            return  res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "A label for the category isn't provided.",
            });
        }

        const newCategory = new Category({ label: categoryLabel, owner: userId });
        await newCategory.save();

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "category successfully created.",
        });

    }catch(error) {

        next(error);
    }

}

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
 * 
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    
    try {
        const { userId } = req.user!;

        const { categoryId } = req.params;

        // let's first remove the category from the notes.
        await Note.updateMany(
            { userId, category: categoryId },
            { $set: { category: null } },
        );

        const deleteCategory = await Category.deleteOne({ 
            _id: categoryId,
            owner: userId,
        });

        //if (deleteCategory.deletedCount === 0) throw new NotFoundError("Category Not Found");
        
        

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Category deleted successfully",
        });
    
    }catch(error) {
        
        next(error);;
    }
}



/**
 * 
 * 
 * @param req 
 * @param res 
 * @returns 
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

