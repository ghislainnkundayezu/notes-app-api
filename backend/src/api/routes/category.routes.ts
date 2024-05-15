import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategoryLabel } from "../controllers";
import { validateCreateCategoryInput, validateDeleteCategoryInput, validateUpdateCategoryInput } from "../validation/validation-schemas";
import { validationHandler } from "../middlewares";

const router = Router();


router
    .route("/")
    .get(getCategories)
    .post(validateCreateCategoryInput, validationHandler, createCategory)
    

router
    .route("/:categoryId")
    .patch(validateUpdateCategoryInput, validationHandler, updateCategoryLabel)
    .delete(validateDeleteCategoryInput, validationHandler, deleteCategory);
    

export default router;