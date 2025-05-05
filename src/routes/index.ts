import { Router } from "express";
import { loginController } from "../controllers/login.controller";
import { signupController } from "../controllers/signup.controller";
import { getProfileController } from "../controllers/getProfile.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", loginController);
router.post("/register", signupController);

router.use(verifyToken);

router.get("/profile", getProfileController);

export default router;