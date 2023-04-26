import express from "express";

const router = express.Router();

router.get("/lack/:token");
router.post("/lack/:token");
router.put("/lack/:token");
router.delete("/lack/:token");

export default router;
