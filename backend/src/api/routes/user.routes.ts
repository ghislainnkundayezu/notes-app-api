import { Router } from "express";
import { getUser, updateUsername } from "../controllers";

const router = Router();

router.get("/user", getUser);
router.patch("/user/update-username", updateUsername);

export default router;