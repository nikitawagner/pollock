import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Statistics from "./Statistics.jsx";
import UpdateVote from "./UpdateVote.jsx";
import "./Landingpage.css";

const Landingpage = () => {
    const [token, setToken] = useState("");
    const [poll, setPoll] = useState(null);
    const [selectedChoice, setSelectedChoice] = useState([]);
    const [name, setName] = useState("");
    const [success, setSuccess] = useState(false);
    const [editToken, setEditToken] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [voices, setVoices] = useState(0);
    const [options, setOptions] = useState([]);
    const [triggerUpdate, setTriggerUpdate] = useState(false);


    const getPoll = async (token) => {
        try {
            const response = await axios.get(
                `http://localhost:49706/poll/lack/${token}`
            );
            if (response.status === 200) {
                const pollData = response.data.poll.body;
                setPoll(pollData);
                setTitle(pollData.title);
                setDescription(pollData.description);
                setVoices(pollData.setting.voices);
                setOptions(pollData.options);
                setTriggerUpdate(prev => !prev);
            } else {
                console.error("Unexpected response: " + JSON.stringify(response));
            }
        } catch (error) {
            console.error("Error: " + error.message);
        }
    };

    const handleChangeChoice = (value, option) => {
        if (value) {
            setSelectedChoice((prevState) => [
                ...prevState,
                { id: option.id, worst: false },
            ]);
        } else {
            setSelectedChoice((prevState) =>
                prevState.filter((choice) => choice.id != option.id)
            );
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:49706/vote/lack/${token}`,
                {
                    owner: {
                        name: name,
                    },
                    choice: selectedChoice,
                }
            );

            if (response.status === 200) {
                setEditToken(response.data.edit.value);
                setSuccess(true);
            } else {
                console.error("Unexpected response: " + JSON.stringify(response));
            }
        } catch (error) {
            console.error("Error: " + error.message);
        }
    };

    const handleCopyToClipboard = async (token) => {
        try {
            await navigator.clipboard.writeText(token);
            alert('Kopieren erfolgreich');
        } catch (error) {
            console.error('Kopieren nicht erfolgreich: ', error);
        }
    };

    return (
        <>
            {!poll ? (
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Token
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="admin-token"
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
            ) : success ? (
                <>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon3">Edit Token</InputGroup.Text>
                        <FormControl
                            readOnly
                            value={editToken}
                        />
                        <Button variant="outline-secondary" onClick={() => handleCopyToClipboard(editToken)}>Copy</Button>
                    </InputGroup>
                    {success && (
                        <UpdateVote
                            editToken={editToken}
                            name={name}
                            selectedChoice={selectedChoice}
                            voices={voices}
                        />
                    )}
                    <Statistics token={token} triggerUpdate={triggerUpdate} />
                </>
            ) : (
                <div className="poll-form">
                    <h1>{title}</h1>
                    <h5>{description}</h5>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">
                            Dein Name
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="name"
                            aria-describedby="inputGroup-sizing-default"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </InputGroup>
                    <div>Anzahl Stimmen: {voices}</div>
                    <div className="options">
                        {options.map((option) => (
                            <div className="option" key={option.id}>
                                <Form.Check
                                    type="checkbox"
                                    className="m-3"
                                    id={`worst-select-${option.id}`}
                                    onChange={(event) =>
                                        handleChangeChoice(event.target.checked, option)
                                    }
                                />
                                <label htmlFor={`worst-select-${option.id}`}>
                                    {option.text}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div>
                        {selectedChoice.map((choice) => (
                            <div key={choice.given_id}>{choice.text}</div>
                        ))}
                    </div>
                    <Button
                        variant="success"
                        disabled={name.length === 0 || selectedChoice.length !== voices}
                        onClick={handleSubmit}
                    >
                        Abstimmen
                    </Button>
                </div>
            )}
        </>
    );
};

export default Landingpage;
