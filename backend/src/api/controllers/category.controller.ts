import { Request, Response } from "express";

import { Category, Note } from "../models";
import { HTTP_BAD_REQUEST, HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, HTTP_NO_CONTENT, HTTP_OK } from "../../config/constants";

/**
 * 
 */
export const createCategory = async (req: Request, res: Response): Promise<Response> => {
    
    try {    

        const { userId } = req.user!;
        const { categoryLabel } = req.body;

        if (!categoryLabel) {
            return  res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "A label for the category isn't provided.",
                null: null,
            });
        }

        const newCategory = new Category({ label: categoryLabel, owner: userId });
        await newCategory.save();

        return res.status(HTTP_CREATED).json({
            success: true,
            message: "category successfully created.",
            error: null,
        });

    }catch(error: any) {
        return  res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create a new category",
            null: error.message,
        });
    }

}

export const updateCategoryLabel = async (req: Request, res: Response) => {
    try {
        const { userId } = req.user!;
        const { categoryId } = req.query;
        const {  newLabel } = req.body;
        
        if( !newLabel || !categoryId ) {
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "Category Id and a new Label are required",
                error: null,
            });
        }

        const category = await Category.findOneAndUpdate(
            { _id: categoryId, owner: userId },
            { $set: { label: newLabel } }
        );

        if (!category) {
            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "Category not found",
                error: null,
            });
        }

        return res.status(HTTP_NO_CONTENT).send();

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to delete category",
            error: error.message,
        });
    }
}

/**
 * 
 */
export const deleteCategory = async (req: Request, res: Response) => {
    
    try {
        const { userId } = req.user!;

        const { categoryId } = req.query;

        // let's first remove the category from the notes.
        const note = await Note.updateMany(
            { userId, category: categoryId },
            { $set: { Category: null } },
        );

        const deleteCategory = await Category.deleteOne({ 
            _id: categoryId,
            owner: userId,
        });

        if (deleteCategory.deletedCount === 0) {
            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "No such category",
                error: null,
            });
        }

        res.status(HTTP_OK).json({
            success: true,
            message: "Category deleted successfully",
            error: null,
        });
    
    }catch(error: any) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to delete category",
            error: error.message,
        });
    }
}



/**
 * 
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getCategories = async (req: Request, res: Response) => {
    try {
        const { userId } = req.user!;

        const categories = await Category.find({ owner: userId });
                                        
        if (categories.length === 0) {
            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "No Categories found",
                data: categories,
                error: null,
            });
        }

        return res.status(HTTP_OK).json({
            success: true,
            data: categories,
            message: "categories successfully retrieved",
            error: null,
        });

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve categories",
            data: null,
            error: error.message,
        });
    }
}

