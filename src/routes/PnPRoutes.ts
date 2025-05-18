import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { showPnP, addPnP } from "../controllers/privacy&policyController";
import { pnpSchema } from "../validations/pnp.validation";

const router = express.Router();

router.post("/add-pnp-terms", authMiddleware, validate(pnpSchema), addPnP);
router.post("/show-pnp-terms", authMiddleware, showPnP);


export default router;
