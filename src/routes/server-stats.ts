import { Router } from "express";

const router = Router();

// TODO: use controller file instead
router.get("/server-up", (req, res) => {
  res.json(true);
});

export default router;
