import { Router } from "express";
import { getUser, updateUsername } from "../controllers";

const router = Router();

router
    .route("/")
    .get(getUser)
    .patch(updateUsername);

export default router;