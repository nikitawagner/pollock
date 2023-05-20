import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import API from "../API";
import Statistics from "./Statistics";

const Landingpage = () => {
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

	const getPoll = async (token) => {
		try {
			const { data } = await API.get(`poll/lack/${token}`);
			setPoll(data);
			setTitle(data.poll.body.title);
			setDescription(data.poll.body.description);
			setOptions(data.poll.body.options);
			setWorst(data.poll.body.setting.worst);
			setVoices(data.poll.body.setting.voices);
		} catch (error) {}
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

	const handleSubmit = async () => {
		try {
			const body = {
				owner: {
					name: name,
				},
				choice: selectedChoice,
			};

			const { data } = await API.post(`/vote/lack/${token}`, body);
			setEditToken(data.edit.value);
			setSuccess(true);
		} catch (error) {
			console.log(error);
			setSuccess(false);
		}
	};

	return (
		<>
			<h1 className="m-3 text-center">TEILNEHMEN</h1>

			{!poll ? (
				<InputGroup className="mb-3">
					<InputGroup.Text id="inputGroup-sizing-default">
						Token
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
			) : success ? (
				<>
					Edit Token: {editToken}
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
							<div className="worst-input" key={option.id}>
								<Form.Check
									type="checkbox"
									className="m-3"
									id="worst-select"
									onChange={() =>
										handleChangeChoice(event.target.checked, option)
									}
								/>
								<div>{option.text}</div>
							</div>
						);
					})}
					<Button
						variant="success"
						disabled={
							name.length > 0 && selectedChoice.length === voices ? false : true
						}
						onClick={handleSubmit}
					>
						Abstimmen
					</Button>
				</>
			)}
		</>
	);
};

export default Landingpage;
