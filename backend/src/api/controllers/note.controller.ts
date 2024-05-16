import { NextFunction, Request, Response } from "express";

import { Note } from "../models";
import { NotFoundError } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";
import mongoose, { Document, MongooseError, QueryOptions, UpdateWriteOpResult } from "mongoose";
import { INote } from "../interfaces/Schemas";



/**
 * Function to create a new Note document or record in the database.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const createNote = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.user!;
        const { title, details, categoryId } = req.body;
        
        const newNote = new Note({
            title: title,
            owner: userId,
        });

        
        if (categoryId) newNote.category = categoryId;
        
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



/**
 * Function to get notes of a particular user.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.user!;
        const { noteId } = req.params;
        const { categoryId, title, details } = req.query;
        
        let query: QueryOptions<INote> = {};

        query.owner = userId;


        if (categoryId) {
            query.category = categoryId;
        }

        if (title) {
            query.title = {$regex: title, $options: "i"};
        }

        if(details) {
            query.details = {$regex: details, $options: "i"}
        }

        if (noteId) {
            query._id = noteId;
        } 

        const notes = await Note.find(query)
                                        .select("-owner -__v")
                                        .populate({
                                            path: 'category',
                                            select: "label -_id"
                                        });


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
 * Function to update data of a particular note document or record in the database.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
 */
export const updateNote = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.user!;
        const { noteId, fieldToUpdate } = req.params;
        const { newValue } = req.body;
        
        const note = await Note.updateOne(
            { _id: noteId, owner: userId },
            { $set: { [fieldToUpdate]: newValue } },
        )
        
        console.log("Matched: ", note.matchedCount, " Modified", note.modifiedCount)

         //TODo: Remember to delete this.
        if (note.matchedCount === 0) throw new NotFoundError("Note not found");

        if (note.modifiedCount === 0) throw new Error("No document was updated");

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "The note was successfully updated."
        });

    }catch(error) {

        next(error);

    }
}




/**
 * Function to delete a particular note document or record in the database.
 * 
 * @param {Request} req - the incomming request object.
 * @param {Response} res - the outgoing request object.
 * @param {NextFunction} next - function to pass control to the next middleware. 
 * @returns {Promise<Response | void>} - Returns a promise that resolves with the response object or passes control to the next middleware.
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





