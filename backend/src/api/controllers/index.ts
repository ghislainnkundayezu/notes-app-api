import { loginUser, logoutUser, registerUser } from "./auth.controller";
import { createCategory, deleteCategory, getCategories, updateCategoryLabel } from "./category.controller";
import { createNote, deleteNote, getNotes, updateNote } from "./note.controller";
import { getUser, updateUsername } from "./user.controller";




export {
    
    registerUser,
    loginUser,
    logoutUser,

    getUser,
    updateUsername,    

    createNote,
    getNotes,
    updateNote,
    deleteNote,

    createCategory,
    getCategories,
    updateCategoryLabel,
    deleteCategory,

};