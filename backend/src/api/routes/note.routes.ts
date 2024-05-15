import { Router } from "express";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers";
import { validateCreateNoteInput, validateDeleteNoteInput, validateGetNotesInput, validateUpdateNoteInput } from "../validation/validation-schemas";
import { validationHandler } from "../middlewares";

const router = Router();

router
    .route("/")
    .post(validateCreateNoteInput, validationHandler, createNote)
     
router
    .route("/:noteId?")
    .get(validateGetNotesInput, validationHandler, getNotes)
    .delete(validateDeleteNoteInput, validationHandler, deleteNote);


router
    .route("/:noteId/:fieldToUpdate")
    .patch(validateUpdateNoteInput, validationHandler, updateNote);


export default router;

