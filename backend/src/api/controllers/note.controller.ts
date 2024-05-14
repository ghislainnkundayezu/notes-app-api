import { NextFunction, Request, Response } from "express";

import { Category, Note } from "../models";
import { HTTP_BAD_REQUEST } from "../../config/constants";
import { NotFoundError } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";
import { QueryOptions } from "mongoose";
import { INote } from "../interfaces/Schemas";

/**
 * 
 */
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user!;
        const { title, details, categoryId } = req.body;
        
        if (!title) {
            return  res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "A note must have a title.",
                null: null,
            });
        }

        const newNote = new Note({
            title: title,
            owner: userId,
        });

        // TODO: case where the category is not found.
        if ((await Category.findOne({_id: categoryId, owner: userId }))) {
            newNote.category = categoryId; 

        }else {
            throw new NotFoundError("Category with that ID Doesn't Exist.");
        }

        if (details) newNote.details = details;

        await newNote.save();

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "A Note was successfully created.",
        });

    }catch(error: any) {

        next(error);

    }
}


export const getNote = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.user!;
        const { noteId } = req.params;

        const note = await Note.findOne({_id: noteId, owner: userId})
                                    .select("-owner")
                                    .populate({
                                        path: 'category',
                                        select: "title -_id"
                                    });     

        return res.status(StatusCodes.OK).json({
            success: true,
            data: note,
            message: "Note Found",
        });

    }catch(error) {
        next(error);
    }
}


export const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.user!;

        const { categoryId, search } = req.query;

        

        let query: QueryOptions<INote> = {};

        query._id = userId;
        query.select = "-owner";
        query.populate = {
            path: 'category',
            select: "title -_id"
        };

        if (categoryId) {
            query.category = categoryId;
        }

        if (search) {
            query.title = {$regex: search, $options: "i"};
        }

        const notes = await Note.find(query);

        if (notes.length === 0) throw new NotFoundError("Notes not found.")
             

        return res.status(StatusCodes.OK).json({
            success: true,
            data: notes,
            message: "Notes Found",
        });

    }catch(error) {
        next(error);
    }
}


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const updateNoteCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        
        const { userId } = req.user!;
        const { noteId } = req.query;
        const { newCategoryId } = req.body;

        if (!newCategoryId || !noteId) {
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "A new category Id and a note id must be provided",
                error: null,
            });
        }

        if (!(await Category.findOne({_id: newCategoryId, owner: userId }))) {
            throw new NotFoundError("Category with that ID doesn't exist.");
        }
        

        const note = await Note.updateOne(
            { _id: noteId, owner: userId },
            { $set: {title: newCategoryId} }
        );
        
        if (note.matchedCount === 0) {
            throw new NotFoundError("No notes found With that category.");
        }

        if (note.modifiedCount === 0) throw new Error("No document was updated");


        return res.status(StatusCodes.NO_CONTENT).send();

    }catch(error) {
        next(error);
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @param updatedField 
 * @param fieldToUpdate 
 * @returns 
 */
const updateField = async (req: Request, res: Response, updatedField: string, fieldToUpdate: string, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.user!;
        const { noteId } = req.query;
        const { [updatedField]: newValue } = req.body;
        
        if( !newValue || !noteId ) {
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: `Note Id and a new ${fieldToUpdate}  are required`,
                error: null,
            });
        }

        const note = await Note.updateOne(
            { _id: noteId, owner: userId },
            { $set: { [fieldToUpdate]: newValue } }
        );

        if (note.matchedCount === 0) throw new NotFoundError("Note not found");

        if (note.modifiedCount === 0) throw new Error("No document was updated");

        return res.status(StatusCodes.NO_CONTENT).send();

    }catch(error) {

        next(error);

    }
}


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const updateNoteTitle = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    
    return updateField(req, res, "newTitle", "title", next);

    //try {
        // const { userId } = req.user!; 
        // const { newTitle, noteId } = req.body;
        
        
    //     if (!newTitle || !noteId) {
    //         return res.status(HTTP_BAD_REQUEST).json({
    //             success: false,
    //             message: "A new title and a note id must be provided",
    //             error: null,
    //         });
    //     }

    //     const note = await Note.updateOne(
    //         { _id: noteId, owner: userId },
    //         { $set: {title: newTitle} }
    //     );
        
    //     if (note.matchedCount === 0) {
    //         return res.status(HTTP_NOT_FOUND).json({
    //             success: true,
    //             message: "Note not found",
    //             error: null,
    //         });
    //     }

    //     if (note.modifiedCount === 0) throw new Error("No document was updated");

    //     return res.status(HTTP_NO_CONTENT).send();

    // }catch(error: any) {
    //     return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
    //         success: false,
    //         message: "Failed to update the title of the note",
    //         error: error.message,
    //     });
    // }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const updateNoteStatus = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    
    return updateField(req, res, "newStatus", "status", next);

    // try {
    //     const { userId } = req.user!; 
    //     const { newStatus, noteId } = req.body;

    //     if (!newStatus || !noteId) {
    //         return res.status(HTTP_BAD_REQUEST).json({
    //             success: false,
    //             message: "A new status and a note id must be provided",
    //             error: null,
    //         });
    //     }

    //     const note = await Note.updateOne(
    //         { _id: noteId, owner: userId },
    //         { $set: {status: newStatus} }
    //     );
        
    //     if (note.matchedCount === 0) {
    //         return res.status(HTTP_NOT_FOUND).json({
    //             success: true,
    //             message: "Note not found",
    //             error: null,
    //         });
    //     }

    //     if (note.modifiedCount === 0) throw new Error("No document was updated");

    //     return res.status(HTTP_NO_CONTENT).send();

    // }catch(error: any) {
    //     return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
    //         success: false,
    //         message: "Failed to update the Status of the note",
    //         error: error.message,
    //     });
    // }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const updateNoteDetails = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    
    return updateField(req, res, "newDetails", "details", next);

    // try {
    //     const { userId } = req.user!; 
    //     const { newDetails, noteId } = req.body;

    //     if (!newDetails || !noteId) {
    //         return res.status(HTTP_BAD_REQUEST).json({
    //             success: false,
    //             message: "Details and a note id must be provided",
    //             error: null,
    //         });
    //     }

    //     const note = await Note.updateOne(
    //         { _id: noteId, owner: userId },
    //         { $set: {details: newDetails} }
    //     );
        
    //     if (note.matchedCount === 0) {
    //         return res.status(HTTP_NOT_FOUND).json({
    //             success: true,
    //             message: "Note not found",
    //             error: null,
    //         });
    //     }

    //     if (note.modifiedCount === 0) throw new Error("No document was updated");

    //     return res.status(HTTP_NO_CONTENT).send();

    // }catch(error: any) {
    //     return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
    //         success: false,
    //         message: "Failed to update the details of the note",
    //         error: error.message,
    //     });
    // }
}



/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } =  req.user!;
        const { noteId } = req.params;

        // TODO: Checking for any errors.
        
        const deletedNote = await Note.deleteOne({_id: noteId, owner: userId});

        //if (deletedNote.deletedCount === 0) throw new Error("Note not found.")

        return res.status(StatusCodes.NO_CONTENT).send();

        
    }catch(error) {

        next(error);
    }
}





