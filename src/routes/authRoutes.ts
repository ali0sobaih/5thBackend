import express from "express";
import authController from "@controllers/authController";
import { validate } from "@middlewares/validate";
import {
  loginUserSchema,
  registerUserSchema,
} from "@validations/user.validation";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = express.Router();

router.post("/register", validate(registerUserSchema), authController.register);
router.post("/login", validate(loginUserSchema), authController.login);
router.post("/logout", authMiddleware, authController.logout);

export default router;
