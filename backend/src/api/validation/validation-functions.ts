import { Types } from "mongoose";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { Category, Note } from "../models";
import { CustomValidator } from "express-validator";
import { INote } from "../interfaces/Schemas";



export const categoryIdValidator: CustomValidator = async (
    categoryId, { req }
) => {
    const { userId } = req.user!;
    
    const isValidMongodbId = Types.ObjectId.isValid(categoryId);
    
    if (!isValidMongodbId) throw new BadRequestError("Invalid Id");

    const category = await Category.findOne({
        _id: categoryId,
    });

    if(!category) throw new NotFoundError("Category Not Found");

    const isOwner = category.owner === userId as unknown as Types.ObjectId;

    if (!isOwner) throw new UnauthorizedError("You're not authorized to perform this action");

}

export const noteIdValidator: CustomValidator = async (
    noteId, { req }
) => {
    const { userId } = req.user!;
    
    const isValidMongodbId = Types.ObjectId.isValid(noteId);
    
    if (!isValidMongodbId) throw new BadRequestError("Invalid Id");

    const note = await Note.findOne({
        _id: noteId,
    });

    if(!note) throw new NotFoundError("Note Not Found");

    const isOwner = note.owner === userId as unknown as Types.ObjectId;

    if (!isOwner) throw new UnauthorizedError("You're not authorized to perform this action");

}

export const notePropertyValidator: CustomValidator = async (
    fieldToUpdate, { req }
) => {
    const { userId } = req.user!;
    
    type Fields = "title" | "details" | "category" | "status";

}

