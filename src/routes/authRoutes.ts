import express from "express";
import passport from "passport";
import authController from "@controllers/authController";
import { validate } from "@middlewares/validate";
import { generateToken } from "@utils/generateToken";
import {
  loginUserSchema,
  registerUserSchema,
} from "@validations/user.validation";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = express.Router();

// Local authentication routes
router.post("/register", validate(registerUserSchema), authController.register);
router.post("/login", validate(loginUserSchema), authController.login);
router.post("/logout", authMiddleware, authController.logout);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account" // 
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failed"
  }),
  (req, res) => {
    const user = req.user as { id: number; email: string };
    const token = generateToken(
      { id: user.id, email: user.email, authStrategy: "google" },
      "1h"
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  }
);

router.get("/auth/google/failed", (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

export default router;