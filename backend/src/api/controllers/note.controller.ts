import { Request, Response } from "express";

import { Category, Note } from "../models";
import { HTTP_BAD_REQUEST, HTTP_CREATED, HTTP_FORBIDDEN, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, HTTP_NO_CONTENT, HTTP_OK } from "../../config/constants";

/**
 * 
 */
export const createNote = async (req: Request, res: Response) => {
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
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "A new category Id and a note id must be provided",
                error: null,
            });
        }

        if (details) newNote.details = details;

        await newNote.save();

        return res.status(HTTP_CREATED).json({
            success: true,
            message: "A Note was successfully created.",
            error: null,
        });

    }catch(error: any) {
        return  res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create a new note",
            null: error.message,
        });
    }
}




/**
 * Controller function to fetch notes of user from the database.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing response object.
 * @returns { Promise<Response> } -A promise that resolves with the response object.
 */
export const getNotes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId } = req.user!;

        const notes = await Note.find({ owner: userId })
                                    .select("title details createAt category -_id -owner")
                                    .populate({
                                        path: 'category',
                                        select: "title -_id"
                                    });

        if (notes.length === 0) {

            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "No notes found",
                data: notes,
                error: null,
            });
        }

        return res.status(HTTP_OK).json({
            success: true,
            data: notes,
            message: "Notes successfully retrieved",
            error: null,
        });

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve notes",
            data: null,
            error: error.message,
        });
    }
}

/**
 * Controller function to fetch notes of a user by category from the database.
 * 
 * @param req - the incomming request object.
 * @param res - the outgoing response object.
 * @returns { Promise<Response> } -A promise that resolves with the response object.
 */
export const getNotesByCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId } = req.user!;
        const categoryLabel = req.query;

        const category = await Category.findOne({
            owner: userId, 
            label: categoryLabel
        });

        if (!category) {
            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "There is no such category",
                data: null,
                error: null,
            });
        }

        const notes = await Note.find({
            owner: userId, 
            category: category._id
        })
        .select("-owner")
        .populate({
            path: "category",
            select: "title -_id",
        });

        
        if (notes.length === 0) {

            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "No notes found",
                data: notes,
                error: null,
            });
        }

        return res.status(HTTP_OK).json({
            success: true,
            data: notes,
            message: "Notes successfully retrieved",
            error: null,
        });

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve notes",
            data: null,
            error: error.message,
        });
    }
}


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const searchNotes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId } = req.user!; 
        const { query } = req.body;

        if (query === "") {
            return  res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "A query must be provided",
                null: null,
            });
        }

        //TODO: check for errors.
        const notes = await Note.find(
            { owner: userId , title: { $regex: query, $options: "i"}}
        )
        .select("-_id -owner")
        .populate({
            path: "category",
            select: "-_id -owner",
        });

        if (notes.length === 0 ) {
            res.status(HTTP_NOT_FOUND).json({
                success: true,
                message: "Notes not found",
                error: null,
                data: null,
            })
        }
        
        return res.status(200).json({
            success: true,
            message: "Notes Found",
            error: null,
            data: notes,

        })

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to search notes.",
            error: error.message,
        });
    }
}


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const updateNoteCategory = async (req: Request, res: Response): Promise<Response> => {
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
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "Invalid category Id",
                error: null,
            });
        }

        const note = await Note.updateOne(
            { _id: noteId, owner: userId },
            { $set: {title: newCategoryId} }
        );
        
        if (note.matchedCount === 0) {
            return res.status(HTTP_NOT_FOUND).json({
                success: true,
                message: "Note not found",
                error: null,
            });
        }

        if (note.modifiedCount === 0) throw new Error("No document was updated");


        return res.status(HTTP_NO_CONTENT).send();

    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update the title of the note",
            error: error.message,
        });
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
const updateField = async (req: Request, res: Response, updatedField: string, fieldToUpdate: string) => {
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

        if (note.matchedCount === 0) {
            return res.status(HTTP_NOT_FOUND).json({
                success: true,
                message: "Note not found",
                error: null,
            });
        }

        if (note.modifiedCount === 0) throw new Error("No document was updated");

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
 * @param req 
 * @param res 
 * @returns 
 */
export const updateNoteTitle = async (req: Request, res: Response): Promise<Response> => {
    
    return updateField(req, res, "newTitle", "title");

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
export const updateNoteStatus = async (req: Request, res: Response): Promise<Response> => {
    
    return updateField(req, res, "newStatus", "status");

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
export const updateNoteDetails = async (req: Request, res: Response): Promise<Response> => {
    
    return updateField(req, res, "newDetails", "details");

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
export const deleteNote = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId } =  req.user!;
        const { noteId } = req.query;

        if (!noteId) {
            return  res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "Please provide the Id of the Note.",
                null: null,
            });
        }

        // TODO: Checking for any errors.
        
        const deletedNote = await Note.deleteOne({_id: noteId, owner: userId});

        if (deletedNote.deletedCount === 0) {
            return res.status(HTTP_NOT_FOUND).json({
                success: false,
                message: "Note not found",
                error: null,
            });
        }


        return res.status(HTTP_NO_CONTENT).send();

        
    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to delete the note.",
            error: error.message,
        });
    }
}





