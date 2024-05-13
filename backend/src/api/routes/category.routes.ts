import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategoryLabel } from "../controllers";

const router = Router();


router.post("/categories/create-category", createCategory);

router
    .route("/categories")
    .get(getCategories)
    .patch(updateCategoryLabel)
    .post(createCategory)
    .delete(deleteCategory);


export default router;