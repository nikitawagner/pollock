import dbConnection from "../prisma/dbConnection.js";
import { v4 } from "uuid";

export const postPollLack = async (req, res, next) => {
	const { title, description, options, setting, fixed } = req.body;
	const newPoll = {
		title: title,
		description: description,
		fixed: fixed,
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

		await dbConnection.poll_settings.create({
			data: {
				voices: setting.voices,
				worst: setting.worst,
				deadline: setting.deadline,
				polls: { connect: { id: pollId } },
			},
		});
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
		const { poll_fk } = await dbConnection.tokens.findFirst({
			where: {
				value: token,
			},
		});

		if (poll_fk > 0) {
			const pollBody = await dbConnection.polls.findFirst({
				where: {
					id: poll_fk,
				},
				include: {
					poll_options: true,
					poll_settings: {
						select: {
							voices: true,
							worst: true,
							deadline: true,
						},
					},
				},
			});
			if (pollBody) {
				// TODO: get participants and options
				res.status(200).json({
					poll: pollBody,
					participants: ["Peter", "Hans"],
					options: [
						{ voted: 2, worst: [0] },
						{ voted: 0, worst: [1] },
					],
				});
			} else {
				res.status(410).json({ code: 410, message: "Poll is gone." });
			}
		} else {
			res.status(404).json({ code: 405, message: "Poll not found." });
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({ code: 405, message: "Poll not found." });
	}
};

export const putPollLack = async (req, res, next) => {
	res.status(200).json({ message: "put" });
};

export const deletePollLack = async (req, res, next) => {
	res.status(200).json({ message: "delete" });
};
