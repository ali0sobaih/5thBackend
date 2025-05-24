import express from "express";
import { validate } from "../middlewares/validate";
import { getEmployees, searchEmployee } from "../controllers/usersController";
import { searchTermSchema } from "../validations/user.validation"

const router = express.Router();

router.get("/get-employees", getEmployees);

router.get("/search-employees", validate(searchTermSchema), searchEmployee);


export default router;
