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
				console.log(tokenId);
				res.status(200).json({ edit: { link: "string", value: tokenValue } });
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
	try {
		try {
			const token = req.params.token;
			const tokenResponse = await dbConnection.tokens.findFirst({
				where: {
					value: token,
				},
			});

			if (tokenResponse && tokenResponse.type === "edit") {
				const pollId = tokenResponse.poll_fk;
				const tokenId = tokenResponse.id;
				const shareTokenFull = await dbConnection.tokens.findFirst({
					where: {
						AND: {
							poll_fk: pollId,
							type: "share",
						},
					},
				});
				const shareToken = shareTokenFull.value;
				const pollResponse = await dbConnection.polls.findFirst({
					where: {
						id: pollId,
					},
					include: {
						poll_options: {
							select: {
								id: true,
								text: true,
							},
						},
						poll_settings: {
							select: {
								voices: true,
								worst: true,
								deadline: true,
							},
						},
					},
				});
				const pollBody = {
					title: pollResponse.title,
					description: pollResponse.description,
					options: pollResponse.poll_options,
					settings: pollResponse.poll_settings,
					fixed: pollResponse.fixed,
				};
				const voteResponse = await dbConnection.votes.findFirst({
					where: {
						edit_token_id_fk: tokenId,
					},
					include: {
						users: {
							select: {
								name: true,
							},
						},
					},
				});
				const voteId = voteResponse.id;
				const owner = voteResponse.users.name;
				const choicesResponse = await dbConnection.vote_choice.findMany({
					where: {
						vote_id_fk: voteId,
					},
					select: {
						poll_option_id_fk: true,
						worst: true,
					},
				});
				const choicesObject = [];
				choicesResponse.map((choice) => {
					choicesObject.push({
						id: choice.poll_option_id_fk,
						worst: choice.worst,
					});
				});
				console.log(choicesObject);
				// TODO choicesObjekt durchgehen aus poll option ... einfach id machen un din choice reinballern
				res.status(200).json({
					poll: {
						body: pollBody,
						share: { link: "string", value: shareToken },
					},
					vote: {
						owner: {
							name: owner,
						},
						choice: choicesObject,
					},
					time: voteResponse.time,
				});
			} else {
				res.status(404).json({
					code: 404,
					message: "Poll not found.",
				});
			}
		} catch (error) {
			console.log(error);
			res.status(405).json({
				code: 405,
				message: "Invalid input",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			code: 404,
			message: "Poll not found.",
		});
	}
};

export const putVoteLack = async (req, res, next) => {
	try {
		try {
			const token = req.params.token;
			const tokenResponse = dbConnection.tokens.findFirst({
				where: {
					id: token,
				},
			});
			console.log(tokenResponse);
			res.status(200).json(tokenResponse);
		} catch (error) {
			res.status(405).json({
				code: 405,
				message: "Invalid input",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			code: 404,
			message: "Poll not found.",
		});
	}
};

export const deleteVoteLack = async (req, res, next) => {
	try {
		try {
			const token = req.params.token;
		} catch (error) {
			res.status(405).json({
				code: 405,
				message: "Invalid input",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			code: 404,
			message: "Poll not found.",
		});
	}
};
