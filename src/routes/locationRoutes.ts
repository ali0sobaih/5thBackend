import express from "express";
import locationsController from "../controllers/locationsController";
import { validate } from "../middlewares/validate";
import { authMiddleware } from "../middlewares/authMiddleware";
import { locationSchema } from "@validations/location.validation";

const router = express.Router();

router.post(
  "/addLocation",
  authMiddleware,
  validate(locationSchema),
  locationsController.addLocation
);

export default router;