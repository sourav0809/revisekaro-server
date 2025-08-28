import express from "express";
import validate from "../middleware/validate";
import { loginSchema, registerSchema } from "../validation/user.validation";
import userController from "../controllers/user.controller";

const router = express.Router();

router.post("/register", validate(registerSchema), userController.registerUser);
router.post("/login", validate(loginSchema), userController.loginUser);

export default router;
