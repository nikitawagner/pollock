import { useEffect, useState } from "react";
import Statistics from "./Statistics";
import InputGroup from "react-bootstrap/InputGroup";
import API from "../API";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const PollResult = () => {
	const [token, setToken] = useState("");
	const [poll, setPoll] = useState(null);
	const [settToken, setSettToken] = useState("");
	const [fixedTexts, setFixedTexts] = useState([]);
	const getPoll = async (token) => {
		try {
			const { data } = await API.get(`poll/lack/${token}`);
			setPoll(data);
			setSettToken(token);
			console.log(data);
			const fixedArray = [];
			data.poll.body.options.map((option) => {
				if (data.poll.body.fixed.includes(option.id)) {
					fixedArray.push(option.text);
				}
			});
			setFixedTexts(fixedArray);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		setSettToken(token);
	}, [token]);
	return (
		<>
			{poll ? (
				<div>
					<h1 className="text-center">Gewinner:</h1>
					{fixedTexts.map((text) => {
						return <h5 className="token-reveal">{text}</h5>;
					})}
					<Statistics token={settToken} />
				</div>
			) : (
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
			)}
		</>
	);
};

export default PollResult;
