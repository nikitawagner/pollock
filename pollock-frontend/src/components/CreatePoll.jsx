import { useState } from 'react';
import PollForm from './PollForm';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['']);
    const [voices, setVoices] = useState(1);
    const [worst, setWorst] = useState(false);
    const [deadline, setDeadline] = useState(null);
    const [fixed, setFixed] = useState([]);
    const [adminToken, setAdminToken] = useState('');
    const [shareToken, setShareToken] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const pollData = {
            title: title,
            description: description,
            options: options.map((option, index) => ({ id: index, text: option })),
            setting: {
                voices: voices,
                worst: worst,
                deadline: new Date(deadline) },
            fixed: fixed.map(optionIndex => ({ text: options[optionIndex] })),
        };

        try {
            const response = await axios.post('http://localhost:49706/poll/lack', pollData);

            if (response.status === 200) {
                alert('Poll created successfully: ' + JSON.stringify(response.data));
                setAdminToken(response.data.admin.value);
                setShareToken(response.data.share.value);
            } else {
                alert('Unexpected response: ' + JSON.stringify(response));
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const deleteOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleCopyToClipboard = async (token) => {
        try {
            await navigator.clipboard.writeText(token);
            alert('Kopieren erfolgreich');
        } catch (error) {
            console.error('Kopieren nicht erfolgreich: ', error);
        }
    };

    console.log(options); //todo: remove

    return (
        <>
            <h1 className="m-3 mb-5 text-center">UMFRAGE ERSTELLEN</h1>
            <PollForm
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                options={options}
                setOptions={setOptions}
                voices={voices}
                setVoices={setVoices}
                worst={worst}
                setWorst={setWorst}
                deadline={deadline}
                setDeadline={setDeadline}
                fixed={fixed}
                setFixed={setFixed}
                handleSubmit={handleSubmit}
                addOption={addOption}
                updateOption={updateOption}
                deleteOption={deleteOption}
            />
            {adminToken && (
                <InputGroup className="mb-3 w-100">
                    <InputGroup.Text id="basic-addon1" className="input-label">Admin Token</InputGroup.Text>
                    <FormControl
                        readOnly
                        value={adminToken}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', margin: '-5px 0' }}>
                        <Button className="btn-copy" variant="outline-secondary" onClick={() => handleCopyToClipboard(adminToken)}>Copy</Button>
                    </div>
                </InputGroup>
            )}

            {shareToken && (
                <InputGroup className="mb-3 w-100">
                    <InputGroup.Text id="basic-addon2" className="input-label">Share Token</InputGroup.Text>
                    <FormControl
                        readOnly
                        value={shareToken}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', margin: '-5px 0' }}>
                        <Button className="btn-copy" variant="outline-secondary" onClick={() => handleCopyToClipboard(shareToken)}>Copy</Button>
                    </div>
                </InputGroup>
            )}
        </>
    );
};

export default CreatePoll;
