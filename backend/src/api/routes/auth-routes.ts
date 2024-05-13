import { Request, Response, Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers";

const router = Router();

router.post("/register", registerUser);

router.post("/registers", async (req: Request, res: Response): Promise<Response> =>{
    const {big} = req.body;
    return res.status(500).json({
        good: "ok",
    })
});

router.route("/registers")
.get(async (req: Request, res: Response): Promise<Response> =>{
    const {big} = req.body;
    return res.status(500).json({
        good: "ok",
    })
});


router.post("/login", loginUser);

router.post("/logout",logoutUser);

export default router;