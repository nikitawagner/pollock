import dbConnection from "../prisma/dbConnection.js";
import { v4 } from "uuid";

export const postPollLack = async (req, res, next) => {
	const { title, description, options, setting, fixed } = req.body;
	const newPoll = {
		title: title,
		description: description,
		fixed: JSON.stringify(fixed),
	};
	try {
		const createdPoll = await dbConnection.polls.create({
			data: newPoll,
			select: { id: true },
		});
		const pollId = createdPoll.id;

		await dbConnection.tokens.createMany({
			data: [
				{
					value: v4(),
					link: "string",
					type: "admin",
					poll_fk: pollId,
				},
				{
					value: v4(),
					link: "string",
					type: "share",
					poll_fk: pollId,
				},
			],
		});

		await Promise.all(
			options.map(async (option) => {
				await dbConnection.poll_options.create({
					data: {
						text: option.text,
						polls: { connect: { id: pollId } },
					},
				});
			})
		);
		if (setting) {
			await dbConnection.poll_settings.create({
				data: {
					voices: setting.voices ? setting.voices : null,
					worst: setting.worst ? 1 : 0,
					deadline: setting.deadline,
					polls: { connect: { id: pollId } },
				},
			});
		} else {
			await dbConnection.poll_settings.create({
				data: {
					voices: null,
					worst: 0,
					deadline: null,
					polls: { connect: { id: pollId } },
				},
			});
		}
		const tokens = await dbConnection.tokens.findMany({
			where: {
				poll_fk: pollId,
			},
			orderBy: {
				type: "asc",
			},
		});
		let adminToken;
		let shareToken;
		tokens.forEach((token) => {
			if (token.type === "admin") {
				adminToken = token;
			} else if (token.type === "share") {
				shareToken = token;
			}
		});
		const resultBody = {
			admin: {
				link: adminToken.link,
				value: adminToken.value,
			},
			share: {
				link: shareToken.link,
				value: shareToken.value,
			},
		};
		res.status(200).json(resultBody);
	} catch (error) {
		console.log(error);
		res.status(405).json({ code: 405, message: "Invalid input" });
	}
};

export const getPollLack = async (req, res, next) => {
	try {
		const token = req.params.token;
		const tokenResponse = await dbConnection.tokens.findFirst({
			where: {
				value: token,
			},
		});

		if (tokenResponse) {
			const poll_fk = tokenResponse.poll_fk;
			const pollBodyResponse = await dbConnection.polls.findFirst({
				where: {
					id: poll_fk,
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
			const setting = {
				voices: pollBodyResponse.poll_settings[0].voices,
				worst: pollBodyResponse.poll_settings[0].worst ? true : false,
				deadline: pollBodyResponse.poll_settings[0].deadline && pollBodyResponse.poll_settings[0].deadline instanceof Date
					? pollBodyResponse.poll_settings[0].deadline.toISOString().substring(
						0,
						pollBodyResponse.poll_settings[0].deadline.toISOString().length - 1
					)
					: null,
			};
			const formattedArray = [];
			pollBodyResponse.poll_options.map((option) => {
				formattedArray.push({
					id: option.given_id,
					text: option.text,
				});
			});
			const shareToken = await dbConnection.tokens.findMany({
				where: {
					AND: {
						type: "share",
						poll_fk: poll_fk,
					},
				},
				select: {
					link: true,
					value: true,
				},
			});
			const pollBody = {
				title: pollBodyResponse.title,
				description: pollBodyResponse.description,
				options: formattedArray,
				setting: setting,
				fixed: JSON.parse(pollBodyResponse.fixed),
			};
			const participants = await dbConnection.user_poll.findMany({
				where: {
					polls_id_fk: poll_fk,
				},
				select: {
					users: {
						select: { name: true, id: true },
					},
				},
			});
			const participantArray = [];
			const participentIdArray = [];
			participants.map((participant) => {
				participantArray.push({ name: participant.users.name });
				participentIdArray.push(participant.users.id);
			});
			const pollOptions = await dbConnection.poll_options.findMany({
				where: {
					poll_id_fk: poll_fk,
				},
			});
			const votesChoice = await dbConnection.vote_choice.findMany({
				where: {
					poll_option_id_fk: {
						in: pollOptions.map((pollOption) => pollOption.id),
					},
				},
			});

			const votes = await dbConnection.votes.findMany({
				where: {
					user_id_fk: {
						in: participentIdArray,
					},
				},
			});
			const statisticsArray = [];
			pollOptions.forEach((option) => {
				const voteIdArray = [];
				votesChoice.forEach((voteChoice) => {
					if (option.id === voteChoice.poll_option_id_fk) {
						voteIdArray.push(voteChoice);
					}
				});
				const userArray = [];
				voteIdArray.forEach((voteChoice) => {
					votes.forEach((vote) => {
						if (vote.id === voteChoice.vote_id_fk) {
							userArray.push({ ...voteChoice, user: vote.user_id_fk });
						}
					});
				});
				statisticsArray.push(userArray);
			});
			const finalArray = [];
			statisticsArray.forEach((statistic) => {
				let body = {
					voted: [],
					worst: [],
				};
				statistic.forEach((element) => {
					let index = participentIdArray.indexOf(element.user);
					if (element.worst === 0) {
						body.voted.push(index);
					} else {
						body.worst.push(index);
					}
				});
				finalArray.push(body);
			});

			if (pollBody) {
				res.status(200).json({
					poll: { body: pollBody, share: shareToken[0] },
					participants: participantArray,
					options: finalArray,
				});
			} else {
				res.status(410).json({ code: 410, message: "Poll is gone." });
			}
		} else {
			res.status(404).json({ code: 404, message: "Poll not found." });
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({ code: 404, message: "Poll not found." });
	}
};

export const putPollLack = async (req, res, next) => {
	const { title, description, options, setting, fixed } = req.body;
	const token = req.params.token;
	const updatedPoll = {
		title: title,
		description: description,
		fixed: JSON.stringify(fixed),
	};
	try {
		const tokenResponse = await dbConnection.tokens.findFirst({
			where: {
				AND: {
					value: token,
					type: "admin",
				},
			},
		});
		if (tokenResponse) {
			let pollId = tokenResponse.poll_fk;
			await dbConnection.polls.update({
				data: updatedPoll,
				where: {
					id: pollId,
				},
			});

			const oldOptions = await dbConnection.poll_options.findMany({
				where: {
					poll_id_fk: pollId,
				},
			});

			await Promise.all(
				oldOptions.map(async (option, index) => {
					await dbConnection.poll_options.update({
						data: {
							text: options[index].text,
						},
						where: {
							id: option.id,
						},
					});
				})
			);

			await dbConnection.poll_settings.updateMany({
				data: {
					voices: setting.voices,
					worst: setting.worst ? 1 : 0,
					deadline: setting.deadline,
				},
				where: {
					polls_fk: pollId,
				},
			});
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

export const deletePollLack = async (req, res, next) => {
	try {
		const tokenResponse = await dbConnection.tokens.findFirst({
			where: {
				AND: {
					value: req.params.token,
					type: "admin",
				},
			},
		});
		if (tokenResponse) {
			const deleteResponse = await dbConnection.polls.delete({
				where: {
					id: tokenResponse.poll_fk,
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
		res.status(404).json({
			code: 404,
			message: "Poll not found.",
		});
	}
};