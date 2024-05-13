import { Router } from "express";
import { createNote, deleteNote, getNotes, getNotesByCategory, searchNotes, updateNoteCategory, updateNoteDetails, updateNoteStatus, updateNoteTitle } from "../controllers";

const router = Router();

router
    .route("/notes")
    .post(createNote)
    .get(getNotes)
    .get(getNotesByCategory)
    .delete(deleteNote);

router.get("/notes/search", searchNotes);

router.patch("/notes/category", updateNoteCategory);
router.patch("/notes/details", updateNoteDetails);
router.patch("/notes/status", updateNoteStatus);
router.patch("/notes/title", updateNoteTitle);




export default router;

