import {useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import API from "../API";
import {FormControl} from "react-bootstrap";

const CreatePoll = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [options, setOptions] = useState([{ id: 0, text: "" }]);
	const [voices, setVoices] = useState(1);
	const [worst, setWorst] = useState(false);
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [adminToken, setAdminToken] = useState("");
	const [shareToken, setShareToken] = useState("");
	const [error, setError] = useState("");

	const addOption = () => {
		setOptions([...options, { id: 0, text: "" }]);
	};
	const handleChangeOption = (value, index) => {
		const element = {
			id: index + 1,
			text: value,
		};
		const newArray = [...options];
		newArray[index] = element;
		setOptions(newArray);
	};

	const deleteOption = (index) => {
		if (options.length > 1) {
			let newArray = options.filter((_, i) => i !== index);
			setOptions(newArray);
		}
	};

	const handleCreatePoll = async () => {
		const body = {
			title: title,
			description: description,
			options: options,
			setting: {
				worst: worst,
				deadline:
					time && date ? new Date(`${date}T${time}Z`).toISOString() : null,
				voices: Number(voices),
			},
			fixed: [0],
		};
		console.log(body);
		const response = await API.post("poll/lack", body);
		if (response.status === 200) {
			setError("");
			setAdminToken(response.data.admin.value);
			setShareToken(response.data.share.value);
		} else {
			setError(response.data.message);
		}
	};

	const handleCopyToClipboard = async (token) => {
		try {
			await navigator.clipboard.writeText(token);
			alert('Copied to Clipboard!');
		} catch (error) {
			console.error('Failed to copy: ', error);
		}
	};

	return (
		<>
			<h1 className="m-3 mb-5 text-center">UMFRAGE ERSTELLEN</h1>
			<h3 className="text-center text-danger">{error}</h3>
			{adminToken.length === 0 ? (
				<>
					<div className="overall">
						<div className="overall-input">
							<InputGroup.Text id="inputGroup-sizing-default">
								Titel
							</InputGroup.Text>
							<Form.Control
								aria-label="title"
								aria-describedby="inputGroup-sizing-default"
								value={title}
								onChange={() => setTitle(event.target.value)}
							/>
						</div>
						<div className="overall-input">
							<InputGroup.Text id="inputGroup-sizing-default">
								Beschreibung
							</InputGroup.Text>
							<Form.Control
								aria-label="title"
								aria-describedby="inputGroup-sizing-default"
								value={description}
								onChange={() => setDescription(event.target.value)}
							/>
						</div>
					</div>
					<div className="options">
						{options.map((option, index) => {
							return (
								<div className="m-1" key={index}>
									<InputGroup.Text id="inputGroup-sizing-default">
										Option {index + 1}
									</InputGroup.Text>
									<Form.Control
										className="option-input"
										aria-label="title"
										aria-describedby="inputGroup-sizing-default"
										onChange={() =>
											handleChangeOption(event.target.value, index)
										}
									/>

									{options.length > 1 ? (
										<Button
											className="option-button"
											variant="danger"
											onClick={() => deleteOption(index)}
										>
											Entfernen
										</Button>
									) : null}
								</div>
							);
						})}
					</div>
					<Button variant="secondary" onClick={addOption} className="w-100">
						Option hinzufügen
					</Button>
					<hr />
					<div className="overall">
						<div className="worst-input">
							<div>Worst</div>
							<Form.Check
								type="checkbox"
								className="m-3"
								id="worst-select"
								checked={worst}
								onChange={() => setWorst(event.target.checked)}
							/>
						</div>
						<div className="worst-input">
							<div>Anzahl Stimmen</div>
							<Form.Control
								type="number"
								min={1}
								className="m-3"
								id="voices-select"
								value={voices}
								onChange={() => setVoices(event.target.value)}
							/>
						</div>
						<div className="worst-input">
							<div>Deadline</div>
							<Form.Control
								type="date"
								className="m-3"
								id="date-select"
								value={date}
								onChange={() => setDate(event.target.value)}
							/>
							<Form.Control
								type="time"
								className="m-3"
								id="time-select"
								value={time}
								onChange={() => setTime(event.target.value)}
							/>
						</div>
					</div>
					<hr />
					<Button
						variant="success"
						disabled={title.length > 1 && options.length > 1 ? false : true}
						onClick={handleCreatePoll}
					>
						Umfrage erstellen
					</Button>{" "}
				</>
			) : (
				<>
					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon1" className="inputGroupText">Admin Token</InputGroup.Text>
						<FormControl
							readOnly
							value={adminToken}
						/>
						<Button variant="outline-secondary" onClick={() => handleCopyToClipboard(adminToken)}>Copy</Button>
					</InputGroup>
					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon2" className="inputGroupText">Share Token</InputGroup.Text>
						<FormControl
							readOnly
							value={shareToken}
						/>
						<Button variant="outline-secondary" onClick={() => handleCopyToClipboard(shareToken)}>Copy</Button>
					</InputGroup>
					<Button
						className="w-100"
						variant="success"
						onClick={() => {
							setAdminToken("");
							setShareToken("");
							setOptions([{ id: 0, text: "" }]);
							setDate("");
							setTime("");
							setWorst(false);
							setTitle("");
							setDescription("");
							setVoices(1);
						}}
					>
						Neuen Umfrage erstellen
					</Button>
				</>
			)}
		</>
	);
};

export default CreatePoll;
