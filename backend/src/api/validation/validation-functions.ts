import { Types } from "mongoose";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { Category, Note, User } from "../models";
import { CustomValidator, Meta } from "express-validator";


export const usernameValidator: CustomValidator = async (username: string) => {
    const usernameExists = await User.findOne({ username: username });
    console.log(usernameExists)
    if (usernameExists) {
        throw new BadRequestError("Username is taken.");
    }   
}


export const emailValidator: CustomValidator = async (email: string) => {
    const emailExists = await User.findOne({ email: email });
    
    if (emailExists) {
        throw new BadRequestError("Email Already Exists");
    }   
}

export const categoryIdValidator: CustomValidator = async (
    categoryId: string, { req }: Meta
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
    noteId: string, { req }: Meta
) => {
    const { userId } = req?.user!;
    
    const isValidMongodbId = Types.ObjectId.isValid(noteId);
    
    if (!isValidMongodbId) throw new BadRequestError("Invalid Id");

    const note = await Note.findOne({
        _id: noteId,
    });

    if(!note) throw new NotFoundError("Note Not Found");
    
    const isOwner = note.owner.equals(Types.ObjectId.createFromHexString(userId)); 

    if (!isOwner) throw new UnauthorizedError("You're not authorized to perform this action");

}

export const notePropertyValidator: CustomValidator = async (
    fieldToUpdate: string, { req, location, path }: Meta
) => {
    const { userId } = req.user!;
    const { newValue } = req.body;
    const { noteId }  = req.params!;

    const allowedFields = ["title", "details", "category", "status"];

    if(!allowedFields.includes(fieldToUpdate)) {
        throw new BadRequestError(
            "The field value isn't allowed. Allowed values are title, details, category, and status"
        );
    }

    const isOwner = await Category.findOne({
        _id: noteId, 
        owner: userId 
    })

    if (!isOwner) throw new UnauthorizedError("You're not authorized to perform this action");

    if (fieldToUpdate === "category" && newValue !== null) {
            categoryIdValidator(newValue, { req, location, path});
    }

    if (fieldToUpdate === "status") {
        const statusValues = ["ongoing", "finished"];

        if(!statusValues.includes(newValue.toLowerCase())) {
            throw new BadRequestError(
                "The status field can either have a value ongoing or finished."
            );
        }

    }
}

