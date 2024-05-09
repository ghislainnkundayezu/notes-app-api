import { Request, Response } from "express";

import { Category, Note } from "../models";
import { HTTP_BAD_REQUEST, HTTP_CREATED, HTTP_FORBIDDEN, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, HTTP_NO_CONTENT } from "../../config/constants";

/**
 * 
 */
export const createNote = async (req: Request, res: Response) => {
    try {
        const { userId } = req.user;
        const { title, details, category } = req.body;
        
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

        // TODO: resolve errors.
        if (category)  newNote.category = category; 
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
 * 
 */
export const deleteNote = async (req: Request, res: Response) => {
    try {
        const { userId } =  req.user;
        const { noteId } = req.body;

        if (!noteId) {
            return  res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "Please provide the Id of the Note.",
                null: null,
            });
        }

        const category = await Category.findOneAndUpdate(
            { notes: { $in: [noteId] }, owner: userId,},
            { $pull: {notes: noteId} },
            { new: true }
        );
        
        if (!category) {
            return res.status(HTTP_FORBIDDEN).json({
                success: false,
                message: "Note not found or unauthorized to delete.",
                error: null
            });
        }
        
        await Note.findOneAndDelete({_id: noteId});

        return res.status(HTTP_NO_CONTENT).send();

        
    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to delete the note.",
            error: error.message,
        });
    }
}

/**
 * 
 */
export const updateNote = async (req: Request, res: Response) => {
    try {
        const { userId } = req.user; 
        const { fieldName, data } = req.body;

        if (!fieldName || !data) {
            return res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "Incomplete data to perform this operation",
                error: null,
            });
        }


        
    }catch(error: any) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update the note",
            error: error.message,
        });
    }
}

/**
 * 
 */
export const searchNotes = async (req: Request, res: Response) => {
    try {
        const { userId } = req.user; 
        const { query } = req.body;

        if (query === "") {
            return  res.status(HTTP_BAD_REQUEST).json({
                success: false,
                message: "A query must be provided",
                null: null,
            });
        }

        //TODO: Remember to index the title field of the Note Model.
        const notes = await Note.find(
            { owner: userId , $text: { $search:  query  }}
        );

        if (notes.length === 0 ) {
            res.status(HTTP_NOT_FOUND).json({
                success: true,
                message: "None Notes matches the query not found",
                error: null,
                data: null,
            })
        }
        
        res.status(200).json({
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