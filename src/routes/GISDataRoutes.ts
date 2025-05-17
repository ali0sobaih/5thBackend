import { Router } from "express";
import { validate } from "../middlewares/validate";
import addCategory from "../controllers/GISDataController";
import { addGISCategorySchema } from "../validations/GISData.validation";
import GISDataController from "../controllers/GISDataController";

const router = Router();

router.post(
  "/addCategory",
  validate(addGISCategorySchema),
  GISDataController.addCategory
);

export default router;