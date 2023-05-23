import dbConnection from "../prisma/dbConnection.js";
import { v4 } from "uuid";

export const postVoteLack = async (req, res, next) => {
	try {
		const token = req.params.token;
		const owner = req.body.owner.name;
		const choices = req.body.choice;
		console.log(req.params.token);
		console.log(req.body);

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
						const optionId = await dbConnection.poll_options.findMany({
							where: {
								AND: {
									given_id: choice.id,
									poll_id_fk: pollId,
								},
							},
						});
						await dbConnection.vote_choice.create({
							data: {
								poll_option_id_fk: optionId[0].id,
								vote_id_fk: voteId,
								worst: choice.worst ? 1 : 0,
							},
						});
					})
				);
				console.log(tokenValue);
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
								given_id: true,
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

				const setting = {
					voices: pollResponse.poll_settings[0].voices,
					worst: pollResponse.poll_settings[0].worst ? true : false,
					deadline: pollResponse.poll_settings[0].deadline
						? pollResponse.poll_settings[0].deadline
						: null,
				};
				const formattedArray = [];
				pollResponse.poll_options.map((option) => {
					formattedArray.push({
						id: option.given_id,
						text: option.text,
					});
				});
				const pollBody = {
					title: pollResponse.title,
					description: pollResponse.description,
					options: formattedArray,
					setting: setting,
					fixed: JSON.parse(pollResponse.fixed),
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
				await Promise.all(
					choicesResponse.map(async (choice) => {
						const givenIdObject = await dbConnection.poll_options.findMany({
							where: {
								id: choice.poll_option_id_fk,
							},
						});
						choicesObject.push({
							id: givenIdObject.length > 0 ? givenIdObject[0].given_id : 1,
							worst: choice.worst ? true : false,
						});
						console.log("Owner: " + owner);
						console.log("CHOICE OBJECT von Carl");
						console.log(choice);
						console.log("GIVEN ID OBJECT after finding the poll");
						console.log(givenIdObject);
					})
				);
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
					time: null,
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
		const token = req.params.token;
		const name = req.body.owner.name;
		const choices = req.body.choice;
		console.log(choices);
		const tokenResponse = await dbConnection.tokens.findFirst({
			where: {
				value: token,
			},
		});
		if (tokenResponse) {
			const votesResponse = await dbConnection.votes.findFirst({
				where: {
					edit_token_id_fk: tokenResponse.id,
				},
			});
			const user = votesResponse.user_id_fk;
			const voteId = votesResponse.id;
			const voteResponse = await dbConnection.votes.updateMany({
				where: {
					AND: {
						user_id_fk: user,
						edit_token_id_fk: tokenResponse.id,
					},
				},
				data: {
					time: new Date(Date.now())
						.toISOString()
						.slice(0, 19)
						.replace("T", " "),
				},
			});
			await dbConnection.users.update({
				where: {
					id: user,
				},
				data: {
					name: name,
				},
			});
			await dbConnection.vote_choice.deleteMany({
				where: {
					vote_id_fk: voteId,
				},
			});

			await Promise.all(
				choices.map(async (choice) => {
					const pollOptionsResponse = await dbConnection.poll_options.findMany({
						where: {
							AND: {
								poll_id_fk: tokenResponse.poll_fk,
								given_id: choice.id,
							},
						},
					});
					console.log(pollOptionsResponse);
					await dbConnection.vote_choice.create({
						data: {
							vote_id_fk: voteId,
							poll_option_id_fk: pollOptionsResponse[0].id,
							worst: choice.worst ? 1 : 0,
						},
					});
				})
			);
			res.status(200).json({
				code: 200,
				message: "i. O.",
			});
		} else {
			res.status(404).json({
				code: 404,
				message: "Poll not found.",
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
			const tokenResponse = await dbConnection.tokens.findFirst({
				where: {
					value: token,
				},
			});
			if (tokenResponse && tokenResponse.type === "edit") {
				const pollId = tokenResponse.poll_fk;
				const tokenId = tokenResponse.id;
				const vote = await dbConnection.votes.findFirst({
					where: {
						edit_token_id_fk: tokenId,
					},
				});
				await dbConnection.votes.deleteMany({
					where: {
						edit_token_id_fk: tokenId,
					},
				});
				await dbConnection.vote_choice.deleteMany({
					where: {
						vote_id_fk: vote.id,
					},
				});
				await dbConnection.tokens.delete({
					where: {
						id: tokenId,
					},
				});
				res.status(200).json({
					code: 200,
					message: "i. O.",
				});
			} else {
				res.status(400).json({
					code: 400,
					message: "Invalid poll admin token.",
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
