import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers";
import { validateLoginInput, validateRegistrationInput } from "../validation/validation-schemas";
import { validationHandler } from "../middlewares";

const router = Router();

router
    .route("/register")
    .post(validateRegistrationInput, validationHandler, registerUser);

router
    .route("/login")
    .post(validateLoginInput, validationHandler,loginUser);

router
    .route("/logout")
    .post(logoutUser);
    

export default router;