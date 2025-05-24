import { Router } from "express";
import { validate, validateFile } from "../middlewares/validate";
import {
  addGeoFileSchema,
  addGISCategorySchema,
  GISDataSchema,
} from "../validations/GISData.validation";
import GISDataController from "../controllers/GISDataController";
import { combineRequestFields } from "../middlewares/combineRequestFields";

import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

// routes/gis.routes.ts
router.post(
  "/gis-file-upload",
  upload.single("file"), // 1. Process multipart/form-data
  (req, res, next) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    next();
  },
  combineRequestFields, // 3. Combine fields
  validateFile(addGeoFileSchema), // 4. Validate
  GISDataController.addGeoFile
);

router.post(
  "/gis-data-upload",
  validate(GISDataSchema),
  GISDataController.addGeoData
);

router.post(
  "/addCategory",
  validate(addGISCategorySchema),
  GISDataController.addCategory
);

router.get("/get-geo-table/:page/:pageSize", GISDataController.getGeoTable);

router.get("/get-geo-map", GISDataController.getGeoMap);

export default router;
