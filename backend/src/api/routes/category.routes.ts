import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategoryLabel } from "../controllers";

const router = Router();


router
    .route("/")
    .get(getCategories)
    .post(createCategory)
    

router
    .route("/:categoryId")
    .patch(updateCategoryLabel)
    .delete(deleteCategory);
    

export default router;