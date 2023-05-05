import dbConnection from "../prisma/dbConnection.js";
import { v4 } from "uuid";

export const postVoteLack = async (req, res, next) => {
	try {
		const token = req.params.token;
		const owner = req.body.owner.name;
		const choices = req.body.choice;

		if (!owner || !choices) {
			res.status(405).json({
				code: 405,
				message: "Invalid input",
			});
		} else {
			const tokenResponse = await dbConnection.tokens.findFirst({
				where: {
					value: token,
				},
			});

			if (tokenResponse) {
				const pollId = tokenResponse.poll_fk;
				const { id } = await dbConnection.users.create({
					data: {
						name: owner,
					},
					select: { id: true },
				});
				await dbConnection.user_poll.create({
					data: {
						polls_id_fk: pollId,
						users_id_fk: id,
					},
				});
				const tokenValue = v4();
				const tokenId = await dbConnection.tokens.create({
					data: {
						value: tokenValue,
						link: "string",
						type: "edit",
						poll_fk: pollId,
					},
					select: { id: true },
				});
				await dbConnection.votes.createMany({
					data: {
						time: new Date(Date.now())
							.toISOString()
							.slice(0, 19)
							.replace("T", " "),
						edit_token_id_fk: tokenId.id,
						user_id_fk: id,
					},
				});

				const voteResponse = await dbConnection.votes.findFirst({
					where: {
						edit_token_id_fk: tokenId.id,
					},
				});
				const voteId = voteResponse.id;
				await Promise.all(
					choices.map(async (choice) => {
						await dbConnection.vote_choice.create({
							data: {
								poll_option_id_fk: choice.id,
								vote_id_fk: voteId,
								worst: choice.worst ? 1 : 0,
							},
						});
					})
				);
				res.status(200).json({ edit: { link: "string", value: token } });
			} else {
				res.status(404).json({
					code: 404,
					message: "Poll not found.",
				});
			}
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			code: 404,
			message: "Poll not found.",
		});
	}
};

export const getVoteLack = async (req, res, next) => {
	const token = req.params.token;
	res.status(200).json({ message: "get" });
};

export const putVoteLack = async (req, res, next) => {
	const token = req.params.token;
	res.status(200).json({ message: "put" });
};

export const deleteVoteLack = async (req, res, next) => {
	const token = req.params.token;
	res.status(200).json({ message: req.params.token });
};
