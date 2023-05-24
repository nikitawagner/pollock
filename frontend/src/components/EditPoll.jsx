import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import API from "../API";
import Statistics from "./Statistics";

const EditPoll = () => {
	const [adminToken, setAdminToken] = useState("");
	const [poll, setPoll] = useState(null);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [options, setOptions] = useState([{ id: 0, text: "" }]);
	const [voices, setVoices] = useState(1);
	const [worst, setWorst] = useState(false);
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [error, setError] = useState("");
	const [fixed, setFixed] = useState([0]);

	const handleChangeOption = (value, index) => {
		const element = {
			id: 0,
			text: value,
		};
		const newArray = [...options];
		newArray[index] = element;
		setOptions(newArray);
	};

	const addOption = () => {
		const newOption = { id: options.length, text: "" };
		setOptions([...options, newOption]);
	};


	const deleteOption = (index) => {
		if (options.length > 1) {
			let newArray = options.filter((_, i) => i !== index);
			setOptions(newArray);
		}
	};

	const getPoll = async (token) => {
		try {
			const { data } = await API.get(`/poll/lack/${token}`);
			setPoll(data);
			setTitle(data.poll.body.title);
			setDescription(data.poll.body.description);
			setOptions(data.poll.body.options);
			setWorst(data.poll.body.setting.worst);
			setVoices(data.poll.body.setting.voices);
			setFixed(data.poll.body.fixed);
			console.log(poll);
		} catch (error) {
			setPoll(null);
		}
	};

	const handleEdit = async () => {
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
			fixed: fixed,
		};
		setPoll(null);
		try {
			const response = await API.put(`poll/lack/${adminToken}`, body);
			setError("");
		} catch (error) {
			setError("Keine Rechte :(");
		}
	};

	const handleDelete = async () => {
		try {
			await API.delete(`/poll/lack/${adminToken}`);
			setPoll(null);
			setError("");
		} catch (error) {
			setError("Keine Rechte :(");
		}
	};

	const handleClickFixed = async (index) => {
		if (fixed.includes(index)) {
			setFixed(fixed.filter((c) => c !== index));
		} else {
			const editedArray = [...fixed];
			editedArray.push(index);
			setFixed(editedArray);
		}
	};

	return (
		<>
			<h1 className="m-3 text-center">UMFRAGE BEARBEITEN</h1>
			<InputGroup>
				<InputGroup.Text id="inputGroup-sizing-default">
					Admin Token
				</InputGroup.Text>
				<Form.Control
					aria-label="admin-tooken"
					aria-describedby="inputGroup-sizing-default"
					value={adminToken}
					onChange={() => setAdminToken(event.target.value)}
				/>
				<Button
					variant="success"
					onClick={() => {
						getPoll(adminToken);
					}}
				>
					Suchen
				</Button>
			</InputGroup>

			<h3 className="text-center text-danger">{error}</h3>

			{!poll ? null : poll.poll.body.fixed.length > 1 ? (
				<div>
					<h1>Umfrage abgeschlossen</h1>
					<Statistics token={adminToken} />
					<Button variant="danger" onClick={handleDelete}>
						LOESCHEN
					</Button>
				</div>
			) : (
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
								<div className="option-container" key={index}>
									<InputGroup.Text id="inputGroup-sizing-default">
										Option {index + 1}
									</InputGroup.Text>
									<Form.Control
										className="option-input"
										aria-label="title"
										aria-describedby="inputGroup-sizing-default"
										value={option.text}
										onChange={() => handleChangeOption(event.target.value, index)}
									/>
									<div className="option-buttons">
										<Button
											className="option-button"
											variant={fixed.includes(index + 1) ? "secondary" : "primary"}
											onClick={() => handleClickFixed(index + 1)}
										>
											{fixed.includes(index + 1) ? "Unfix" : "Fix"}
										</Button>
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
								</div>
							);
						})}
					</div>
					<hr />
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
					<Button variant="danger" onClick={handleDelete} className="w-100">
						LOESCHEN
					</Button>
					<Button
						variant="success"
						className="w-100"
						onClick={handleEdit}
						disabled={title.length > 1 && options.length > 1 ? false : true}
					>
						Bearbeiten
					</Button>
					<Statistics token={adminToken} />
				</>
			)}
		</>
	);
};

export default EditPoll;
