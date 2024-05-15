import { Router } from "express";
import { getUser, updateUsername } from "../controllers";
import { validateUpdateUsernameInput } from "../validation/validation-schemas";
import { validationHandler } from "../middlewares";

const router = Router();

router
    .route("/")
    .get(getUser)
    .patch(validateUpdateUsernameInput, validationHandler, updateUsername);

export default router;