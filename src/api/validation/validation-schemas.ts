import { body, param, query } from "express-validator";
import { noteIdValidator, categoryIdValidator, emailValidator, notePropertyValidator, usernameValidator, queryParamValidator } from "./validators";

// authentication.

/**
 *  Validation chain of Username. 
 * 
 * @returns {Array} - An array of validation rules.
 */
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

/**
 *  Validation chain of data for User Registration. 
 * 
 * @returns {Array} - An array of validation rules.
*/
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

/** 
 * Validation chain of data for User Login. 
 * 
 * @returns {Array} - An array of validation rules.
*/
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
/**
 *  Validation chain of data for updating a username. 
 * 
 * @returns {Array} - An array of validation rules.
*/
export const validateUpdateUsernameInput = [
    usernameValidateChain()
    .custom(usernameValidator),

];

//categories.
/**
 *  Validation chain of data for creating a category. 
 * 
 * @returns {Array} - An array of validation rules.
*/
export const validateCreateCategoryInput = [
    body("label")
        .notEmpty()
        .withMessage("A label for the category is required")
        .isAlphanumeric()
        .withMessage("A laabel can contain letters and numbers only.")
        .trim()
        .toLowerCase()
        
];

/**
 *  Validation chain of data for updating the label of a category. 
 * 
 * @returns {Array} - An array of validation rules.
*/
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

/** 
 * 
 * Validation chain of data for deleting a category.
 * 
 * @returns {Array} - An array of validation rules.
 */
export const validateDeleteCategoryInput = [
    param("categoryId")
        .notEmpty()
        .withMessage("Category ID is required")
        .trim()
        .custom(categoryIdValidator)
];


// notes.
/**
 *  Validation chain of data for creating a note.
 * 
 * @returns {Array} - An array of validation rules.
 */
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


/** 
 * Validation chain of a data for getting or searching notes.
 * 
 * @returns {Array} - An array of validation rules.
 */
export const validateGetNotesInput = [
    query()
    .custom(queryParamValidator),

    query("categoryId")
        .optional()
        .trim()
        .custom(categoryIdValidator),
    
    query("title")
        .optional()
        .matches(/^[\w\s]+$/)
        .withMessage("A query can container letters and numbers only"),
        

    query("details")
        .optional()
        .isString()
        .withMessage("Details can only be a string."),
        

    param("noteId")
        .optional()
        .trim()
        .custom(noteIdValidator),
        
];


/** 
 * Validation chain of data for updating info about a note. 
 * 
 * @returns {Array} - An array of validation rules.
 */
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


/** 
 * Validation chain of of data for deleting a note. 
 * 
 * @returns {Array} - An array of validation rules.
 */
export const validateDeleteNoteInput = [
    param("noteId")
        .notEmpty()
        .withMessage("A note id is required")
        .trim()
        .custom(noteIdValidator)
];
