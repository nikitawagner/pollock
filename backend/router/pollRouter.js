import express from "express";
import {
	deletePollLack,
	getPollLack,
	postPollLack,
	putPollLack,
} from "../service/pollService.js";

const router = express.Router();

router.get("/lack/:token", getPollLack);
router.post("/lack", postPollLack);
router.put("/lack/:token", putPollLack);
router.delete("/lack/:token", deletePollLack);

export default router;
