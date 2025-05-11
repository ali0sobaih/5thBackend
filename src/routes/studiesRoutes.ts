import express from "express";
import studiesController from "../controllers/studiesController";
import { validate } from "../middlewares/validate";
import { addStudySchema } from "../validations/study.validation";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/addStudy",
  authMiddleware,
  validate(addStudySchema),
  studiesController.addStudy
);

export default router;
