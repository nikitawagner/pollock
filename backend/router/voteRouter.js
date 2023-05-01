import express from "express";

const router = express.Router();

router.get("/lack/:token", (req, res, next) => {
	res.status(200).json({ message: "hi" });
});
router.post("/lack/:token");
router.put("/lack/:token");
router.delete("/lack/:token");

export default router;
