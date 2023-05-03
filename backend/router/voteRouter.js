import express from "express";
import {
	deleteVoteLack,
	getVoteLack,
	postVoteLack,
	putVoteLack,
} from "../service/voteService.js";

const router = express.Router();

router.get("/lack/:token", getVoteLack);
router.post("/lack/:token", postVoteLack);
router.put("/lack/:token", putVoteLack);
router.delete("/lack/:token", deleteVoteLack);

export default router;
