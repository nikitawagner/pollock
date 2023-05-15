import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import API from "../API";

const EditPoll = () => {
	const [adminToken, setAdminToken] = useState("");
	return (
		<>
			<h1 className="m-3 text-center">UMFRAGE BEARBEITEN</h1>
			<InputGroup className="mb-3">
				<InputGroup.Text id="inputGroup-sizing-default">
					Admin Token
				</InputGroup.Text>
				<Form.Control
					aria-label="admin-tooken"
					aria-describedby="inputGroup-sizing-default"
					value={adminToken}
					onChange={() => setAdminToken(event.target.value)}
				/>
				<Button variant="success">Suchen</Button>
			</InputGroup>
		</>
	);
};

export default EditPoll;
