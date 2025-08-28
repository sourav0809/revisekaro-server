import express from "express";
import validate from "../middleware/validate";
import { registerSchema } from "../validation/user.validation";

const router = express.Router();

router.post("/register", validate(registerSchema));

export default router;
