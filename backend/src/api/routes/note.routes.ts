import { Router } from "express";
import { createNote, deleteNote, getNote, getNotes, getNotesByCategory, searchNotes, updateNoteCategory, updateNoteDetails, updateNoteStatus, updateNoteTitle } from "../controllers";

const router = Router();

router
    .route("/")
    .post(createNote)
    .get(getNotes)
    .get(getNotesByCategory)
    

router
    .route("/:noteId")
    .get(getNote)
    .delete(deleteNote);

router.get("/search", searchNotes);

router.patch("/category", updateNoteCategory);
router.patch("/details", updateNoteDetails);
router.patch("/status", updateNoteStatus);
router.patch("/title", updateNoteTitle);




export default router;

