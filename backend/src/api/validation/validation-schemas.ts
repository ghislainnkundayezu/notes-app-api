import { body, param, query } from "express-validator";
import { Category, User } from "../models";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
import mongoose from "mongoose";
import { Request } from "express";
import { noteIdValidator, categoryIdValidator } from "./validation-functions";

//authenticaton.
const usernameValidateChain = () => {
    return body("username")
            .notEmpty()
            .withMessage("Username is required")
            .isLength({min: 3})
            .withMessage("A username must be atleast 3 characters")
            .isAlphanumeric()
            .withMessage("A Username can contain letters and numbers only.")
            .trim()
            .toLowerCase()
}

export const validateRegistrationInput = [
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({min: 3})
        .withMessage("A username must be atleast 3 characters")
        .isAlphanumeric()
        .withMessage("A Username can contain letters and numbers only.")
        .trim()
        .toLowerCase(),

    body("email")
        .notEmpty()
        .withMessage("Email is Required")
        .isEmail()
        .withMessage("Invalid Email Format")
        .trim()
        .custom(async (email) => {
            const emailExists = await User.findOne({ email: email });
            
            if (emailExists) {
                throw new BadRequestError("Email Already Exists");
            }   
        }),
    
    body("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({min: 8})
    .withMessage("Password must be atleast 8 characters long")


];

export const validateLoginInput = [
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({min: 3})
        .withMessage("A username must be atleast 3 characters")
        .isAlphanumeric()
        .withMessage("A Username can contain letters and numbers only.")
        .trim()
        .toLowerCase(),

    body("email")
        .notEmpty()
        .withMessage("Email is Required")
        .isEmail()
        .withMessage("Invalid Email Format")
        .trim(),
        
    body("password")
    .notEmpty()
    .withMessage("Passowrd is Required")
    .isLength({min: 8})
    .withMessage("Password must be atleast 8 characters long")

];



//users.
export const validateUpdateUsernameInput = [
    body("username")
        .notEmpty()
        .withMessage("A Username is required")
        .isLength({min: 3})
        .withMessage("A username must be atleast 3 characters")
        .isAlphanumeric()
        .withMessage("A Username can contain letters and numbers only.")
        .trim()
        .toLowerCase(),

];

//categories.
export const validateCreateCategoryInput = [
    body("categoryLabel")
        .notEmpty()
        .withMessage("A label for the category is required")
        .isAlphanumeric()
        .withMessage("A laabel can contain letters and numbers only.")
        .trim()
        .toLowerCase()
        
];


export const validateUpdateCategoryInput = [
    param("categoryId")
        .notEmpty()
        .withMessage("Category ID is required")
        .custom(categoryIdValidator),

    body("newLabel")
        .notEmpty()
        .withMessage("A label for the category is required")
        .isAlphanumeric()
        .withMessage("A laabel can contain letters and numbers only.")
        .trim()
        .toLowerCase()
];

export const validateDeleteCategoryInput = [
    param("categoryId")
        .notEmpty()
        .withMessage("Category ID is required")
        .trim()
        .custom(categoryIdValidator)
];


// notes.
 
export const validateCreateNoteInput = [
    body("title")
        .notEmpty()
        .withMessage("A title is required")
        .isAlphanumeric()
        .withMessage("A title can contain only letters and numbers")
        .toLowerCase()
        .trim(),

    body("details")
        .optional()
        .isString()
        .withMessage("Details must be a string")
        .escape()
        .trim(),

    body("categoryId")
        .notEmpty()
        .withMessage("A category Id is required")
        .trim()
        .custom(categoryIdValidator)
];

export const validateGetNoteInput = [
    param("noteId")
        .notEmpty()
        .withMessage("A note id is required")
        .trim()
        .custom(noteIdValidator)
];

export const getNotesInput = [
    query("categoryId")
        .optional()
        .trim()
        .custom(categoryIdValidator),
    
    query("search")
        .optional()
        .isAlphanumeric()
        .withMessage("A query can container letters and numbers only"),
        
];

export const updateNote = [
    param("noteId")
        .notEmpty()
        .withMessage("A note id is required")
        .trim()
        .custom(noteIdValidator),
    
    param("fieldToUpdate")
        .notEmpty()
        .withMessage("A note id is required")
        .trim(),
        //.custom(fieldValidator),

    body("newValue")
        .notEmpty()
        .withMessage("A note id is required")
        .trim()
        .custom(noteIdValidator),
];



export const updateNoteCategory = [];

export const validateDeleteNoteInput = [
    param("noteId")
        .notEmpty()
        .withMessage("A note id is required")
        .trim()
        .custom(noteIdValidator) 
];
