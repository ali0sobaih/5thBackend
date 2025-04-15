import express from "express";
import { validate } from "@middlewares/validate";
import authorizationController from "@controllers/AuthorizationController"
import { assignRoleSchema } from "@validations/autherization.validation";

const router = express.Router();

router.post(
  "/giverole/:id",
  validate(assignRoleSchema),
  authorizationController.giveRole
);
router.post(
  "/deleteRole/:id",
  validate(assignRoleSchema),
  authorizationController.deleteRole
);


export default router