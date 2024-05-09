import { Request, Response } from "express";

import { Category } from "../models";
import { HTTP_BAD_REQUEST, HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, HTTP_OK } from "../../config/constants";

/**
 * 
 */
export const createCategory = async (req: Request, res: Response): Promise<Response> => {
    
    try {    

        const { userId } = req.user;
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

/**
 * 
 */
export const deleteCategory = async (req: Request, res: Response) => {
    const { userId } = req.user;

    const { categoryId } = req.body;
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
        const { userId } = req.user;

        const categories = await Category
                                        .find({ owner: userId })
                                        .populate("label");

        if (categories.length === 0) {
            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "No notes found",
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