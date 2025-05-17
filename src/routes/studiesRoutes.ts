import express from "express";
import studiesController from "../controllers/studiesController";
import { validate } from "../middlewares/validate";
import {
  addStudySchema,
  updateLocationSchema,
} from "../validations/study.validation";
import { GISDataArraySchema } from "../validations/GISData.validation";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/addToDraft",
  authMiddleware,
  validate(addStudySchema),
  studiesController.addStudy
);

router.patch(
  "/updateLocation",
  authMiddleware,
  validate(updateLocationSchema),
  studiesController.updateLocation
);

router.patch(
  "/updateGIS/:study_id",
  authMiddleware,
  validate(GISDataArraySchema),
  studiesController.updateGIS
);

router.patch(
  "/saveStudy/:study_id",
  authMiddleware,
  studiesController.saveStudy
);

router.post(
  "/setMinRecommendedEntries/:num",
  authMiddleware,
  studiesController.setMinRecommendedEntries
);

router.get("/showAIPending", authMiddleware, studiesController.showAIPending);
export default router;
