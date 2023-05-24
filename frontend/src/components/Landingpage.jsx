import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import API from "../API";
import Statistics from "./Statistics";
import {FormControl} from "react-bootstrap";

const Landingpage = () => {
	const [token, setToken] = useState("");
	const [poll, setPoll] = useState(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [options, setOptions] = useState([{ id: 0, text: "" }]);
	const [voices, setVoices] = useState(1);
	const [selectedChoice, setSelectedChoice] = useState([]);
	const [name, setName] = useState("");
	const [worst, setWorst] = useState(false);
	const [success, setSuccess] = useState(false);
	const [editToken, setEditToken] = useState("");
	const [worstArray, setWorstArray] = useState([]);

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
			const editedArray = selectedChoice.filter((choice) => choice.id !== option.id);
			setSelectedChoice(editedArray);
		}
		console.log(selectedChoice);
	};

	const handleChangeWorst = (value, option) => {
		console.log(option);
		if (value === true) {
			const editedArray = [...worstArray];
			editedArray.push(option);
			setWorstArray(editedArray);
		} else {
			const editedArray = worstArray.filter((choice) => choice.id !== option.id);
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

			const { data } = await API.post(`/vote/lack/${token}`, body);
			setEditToken(data.edit.value);
			setSuccess(true);
		} catch (error) {
			console.log(error);
			setSuccess(false);
		}
	};

	const handleCopyToClipboard = async (token) => {
		try {
			await navigator.clipboard.writeText(token);
			//alert("Copied to Clipboard!");
		} catch (error) {
			console.error("Failed to copy: ", error);
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
						onChange={(event) => setToken(event.target.value)}
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
					<Statistics token={token} />
				</div>
			) : success ? (
				<>
					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon2" className="inputGroupText">
							Edit Token
						</InputGroup.Text>
						<FormControl readOnly value={editToken} />
						<Button
							variant="outline-secondary"
							onClick={() => handleCopyToClipboard(editToken)}
						>
							Copy
						</Button>
					</InputGroup>
					<Statistics token={token} />
				</>
			) : (
				<>
					<h1>Titel: {title}</h1>
					<h5>Beschreibung: {description.length === 0 ? "/" : description}</h5>
					{/* {selectedChoice.map((choice) => {
              return <div>{choice.text}</div>;
            })} */}
					<InputGroup className="mb-3">
						<InputGroup.Text id="inputGroup-sizing-default">
							Dein Name
						</InputGroup.Text>
						<Form.Control
							aria-label="admin-tooken"
							aria-describedby="inputGroup-sizing-default"
							value={name}
							onChange={(event) => setName(event.target.value)}
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
										disabled={
											worstArray.filter((choice) => choice.id === option.id)
												.length > 0
										}
										onChange={(event) =>
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
										onChange={(event) =>
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
						className="w-100"
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
