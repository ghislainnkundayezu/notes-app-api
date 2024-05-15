import { body, param, query } from "express-validator";
import { noteIdValidator, categoryIdValidator, emailValidator, notePropertyValidator, usernameValidator } from "./validation-functions";

//authentication.

//TODO: Remember to decide what to do with this line.
const usernameValidateChain = () => {
    return body("username")
            .notEmpty()
            .withMessage("Username is required")
            .isLength({min: 3})
            .withMessage("A username must be atleast 3 characters")
            .isAlphanumeric()
            .withMessage("A Username can be one word with only letters or numbers.")
            .trim()
            .toLowerCase()
}

export const validateRegistrationInput = [
    usernameValidateChain()
    .custom(usernameValidator),

    body("email")
        .notEmpty()
        .withMessage("Email is Required")
        .isEmail()
        .withMessage("Invalid Email Format")
        .trim()
        .custom(emailValidator),
    
    body("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({min: 8})
    .withMessage("Password must be atleast 8 characters long")


];

export const validateLoginInput = [
    usernameValidateChain(),

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
    usernameValidateChain()
    .custom(usernameValidator),

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
        .isString()
        .withMessage("A title can contain must be a string")
        .toLowerCase()
        .trim(),

    body("details")
        .optional()
        .isString()
        .withMessage("Details must be a string")
        .escape()
        .trim(),

    body("categoryId")
        .optional()
        .trim()
        .custom(categoryIdValidator)
];


export const validateGetNotesInput = [
    query("categoryId")
        .optional()
        .trim()
        .custom(categoryIdValidator),
    
    query("search")
        .optional()
        .isAlphanumeric()
        .withMessage("A query can container letters and numbers only"),

    param("noteId")
        .optional()
        .trim()
        .custom(noteIdValidator),
        
];

export const validateUpdateNoteInput = [
    param("noteId")
        .notEmpty()
        .withMessage("A note id is required")
        .trim()
        .custom(noteIdValidator),
    
    param("fieldToUpdate")
        .notEmpty()
        .withMessage("A note id is required")
        .trim()
        .toLowerCase()
        .custom(notePropertyValidator),

    body("newValue")
        .notEmpty()
        .withMessage("A new value required is required")
        .trim()
        .escape()
];


export const validateDeleteNoteInput = [
    param("noteId")
        .notEmpty()
        .withMessage("A note id is required")
        .trim()
        .custom(noteIdValidator) 
];
