import { Types } from "mongoose";
import { BadRequestError, CustomValidationError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { Category, Note, User } from "../models";
import { CustomValidator, Meta } from "express-validator";


/**
 * Checks if a username doesn't already exist in the database.
 * 
 * @param username - An alphanumeric string.
 */
export const usernameValidator: CustomValidator = async (username: string) => {
    const usernameExists = await User.findOne({ username: username });
    if (usernameExists) {
        throw new BadRequestError("Username is taken.");
    }   
}

/**
 * Checks if an email doesn't already exist in the database.
 * 
 * @param email 
 */
export const emailValidator: CustomValidator = async (email: string) => {
    const emailExists = await User.findOne({ email: email });
    
    if (emailExists) {
        throw new BadRequestError("Email Already Exists");
    }   
}

/**
 * Checks if a category Id is valid.
 * 
 * It performs the following checks:
 * 
 * It checks if the category Id is a valid mongo DB Object Id.
 * It checks if the category Id is in the database.
 * It checks if the user Id in the request is the owner of the category Id. 
 * 
 * @param {string} categoryId 
 * @param {Meta} param1 - An object containing the req objext
 */
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
   
    const isOwner = category.owner.equals(Types.ObjectId.createFromHexString(userId));

    if (!isOwner) throw new UnauthorizedError("You're not authorized to perform this action");

}


/**
 * Checks if a note Id is valid.
 * 
 * It performs the following checks:
 * 
 * It checks if the note Id is a valid mongo DB Object Id.
 * It checks if the note Id is in the database.
 * It checks if the user Id in the request is the owner of the note Id. 
 *  
 * @param noteId 
 * @param param1 
 */
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

/**
 * 
 * 
 *
 *
 *  
 * @param fieldToUpdate 
 * @param param1 
 */
export const notePropertyValidator: CustomValidator = async (
    fieldToUpdate: string, { req, location, path }: Meta
) => {
    
    const { newValue } = req.body;

    const allowedFields = ["title", "details", "category", "status"];

    if(!allowedFields.includes(fieldToUpdate)) {
        throw new BadRequestError(
            "The field value isn't allowed. Allowed values are title, details, category, and status"
        );
    }

    if (fieldToUpdate === "category" && newValue !== null) {
        await categoryIdValidator(newValue, { req, location, path});
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

/**
 * 
 * @param value 
 * @param param1 
 */
export const queryParamValidator: CustomValidator = async (
   value: string, { req, location, path }: Meta
) => {
    const validQueryParams = ["title", "details", "categoryId"]
    const queries = req.query && Object.keys(req.query);

    queries?.forEach(query => {
        if (!validQueryParams.includes(query)) {
            throw new BadRequestError("Invalid query parameter names: Parameters can either be title, details or categoryId");
        }
    });
}