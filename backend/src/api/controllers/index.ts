import { loginUser, logoutUser, registerUser } from "./auth.controller";
import { createCategory, deleteCategory, getCategories, updateCategoryLabel } from "./category.controller";
import { createNote, deleteNote, getNote, getNotes, getNotesByCategory, searchNotes, updateNoteCategory, updateNoteDetails, updateNoteStatus, updateNoteTitle } from "./note.controller";
import { getUser, updateUsername } from "./user.controller";




export {
    registerUser,
    loginUser,
    logoutUser,

    getUser,
    updateUsername,    

    createNote,
    getNote,
    getNotes,
    getNotesByCategory,
    searchNotes,
    updateNoteCategory,
    updateNoteDetails,
    updateNoteStatus,
    updateNoteTitle,
    deleteNote,

    createCategory,
    getCategories,
    updateCategoryLabel,
    deleteCategory,

};