import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import API from "../API";
import Statistics from "./Statistics";

const EditVote = () => {
	const [token, setToken] = useState("");
	const [poll, setPoll] = useState(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [options, setOptions] = useState([{ id: 0, text: "" }]);
	const [voices, setVoices] = useState(1);
	const [selectedChoice, setSelectedChoice] = useState([]);
	const [name, setName] = useState("");
	const [success, setSuccess] = useState(false);
	const [editToken, setEditToken] = useState("");
	const [worst, setWorst] = useState(false);
	const [votedName, setVotedName] = useState("");
	const [votedChoices, setVotedChoices] = useState([]);
	const [worstArray, setWorstArray] = useState([]);

	const getPoll = async (token) => {
		try {
			console.log(123);
			const { data } = await API.get(`vote/lack/${token}`);
			setPoll(data);
			setTitle(data.poll.body.title);
			setDescription(data.poll.body.description);
			setOptions(data.poll.body.options);
			setWorst(data.poll.body.setting.worst);
			setVoices(data.poll.body.setting.voices);
			setSelectedChoice(data.vote.choice);
			setName(data.vote.owner.name);
		} catch (error) {
			console.log(error);
		}
	};

	const handleChangeChoice = (value, option) => {
		console.log(option);
		if (value === true) {
			const editedArray = [...selectedChoice];
			editedArray.push(option);
			setSelectedChoice(editedArray);
		} else {
			const editedArray = selectedChoice.filter(
				(choice) => choice.id != option.id
			);
			setSelectedChoice(editedArray);
		}
	};

	const handleChangeWorst = (value, option) => {
		console.log(option);
		if (value === true) {
			const editedArray = [...worstArray];
			editedArray.push(option);
			setWorstArray(editedArray);
		} else {
			const editedArray = worstArray.filter((choice) => choice.id != option.id);
			setWorstArray(editedArray);
		}
	};

	const handleSubmit = async () => {
		try {
			const formatedArray = [];
			selectedChoice.forEach((choice) => {
				formatedArray.push({ id: choice.id, worst: 0 });
			});
			worstArray.forEach((choice) => {
				formatedArray.push({ id: choice.id, worst: 1 });
			});
			const body = {
				owner: {
					name: name,
				},
				choice: formatedArray,
			};
			console.log(body);
			const { data } = await API.put(`/vote/lack/${token}`, body);
			console.log(data);
			setSuccess(true);
		} catch (error) {
			console.log(error);
			setSuccess(false);
		}
	};

	const handleDelete = async () => {
		await API.delete(`/vote/lack/${token}`);
		setPoll(null);
	};

	return (
		<>
			<h1 className="m-3 text-center">VOTE BEARBEITEN</h1>
			{!poll ? (
				<InputGroup className="mb-3">
					<InputGroup.Text id="inputGroup-sizing-default">
						Edit Token
					</InputGroup.Text>
					<Form.Control
						aria-label="admin-tooken"
						aria-describedby="inputGroup-sizing-default"
						value={token}
						onChange={() => setToken(event.target.value)}
					/>
					<Button
						variant="success"
						onClick={() => {
							getPoll(token);
						}}
					>
						Suchen
					</Button>
				</InputGroup>
			) : poll.poll.body.fixed.length > 1 ? (
				<div>
					<h1>Umfrage abgeschlossen</h1>
				</div>
			) : success ? (
				<>
					<Statistics token={token} />
				</>
			) : (
				<>
					<h1>{title}</h1>
					<h5>{description}</h5>
					{selectedChoice.map((choice) => {
						return <div>{choice.text}</div>;
					})}
					<InputGroup className="mb-3">
						<InputGroup.Text id="inputGroup-sizing-default">
							Dein Name
						</InputGroup.Text>
						<Form.Control
							aria-label="admin-tooken"
							aria-describedby="inputGroup-sizing-default"
							value={name}
							onChange={() => setName(event.target.value)}
						/>
					</InputGroup>
					<div>Anzahl Stimmen: {voices}</div>

					{options.map((option) => {
						return (
							<div className="worst-select">
								<div className="worst-input" key={option.id}>
									<Form.Check
										type="checkbox"
										className="m-3"
										id="worst-select"
										checked={selectedChoice.find((c) => c.id === option.id)}
										onChange={() =>
											handleChangeChoice(event.target.checked, option)
										}
									/>
									<div>{option.text}</div>
								</div>
								<div className="worst-input" key={option.id + "worst"}>
									<Form.Check
										type="checkbox"
										className="m-3"
										disabled={
											!worst ||
											selectedChoice.filter((choice) => choice.id === option.id)
												.length > 0
										}
										id="worst-select"
										onChange={() =>
											handleChangeWorst(event.target.checked, option)
										}
									/>
									<div>worst</div>
								</div>
							</div>
						);
					})}
					<Button
						variant="success"
						disabled={
							name.length > 0 &&
							((selectedChoice.length <= voices && selectedChoice.length > 0) ||
								worstArray.length === 1) &&
							selectedChoice.length <= voices &&
							worstArray.length < 2
								? false
								: true
						}
						onClick={handleSubmit}
					>
						Abstimmen
					</Button>
					<Button variant="danger" onClick={handleDelete}>
						LOESCHEN
					</Button>
				</>
			)}
		</>
	);
};

export default EditVote;
