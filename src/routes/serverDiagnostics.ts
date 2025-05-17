import { Router } from "express";

const router = Router();

// TODO: use controller file instead
router.get("/server-up", (req, res) => {
  console.log("testing...");
  res.json(true);
});

export default router;
