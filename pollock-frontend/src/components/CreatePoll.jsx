import axios from 'axios';
import { useState } from 'react';
import { Form, Button, Container, InputGroup, FormControl } from 'react-bootstrap';

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['']);
    const [voices, setVoices] = useState(1);
    const [worst, setWorst] = useState(false);
    const [deadline, setDeadline] = useState(null);
    const [fixed, setFixed] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const pollData = {
            title,
            description,
            options: options.map((option) => ({text: option})),
            setting: {voices, worst, deadline},
            fixed,
        };

        try {
            const response = await axios.post('http://localhost:49706/poll/lack', pollData);

            if (response.status === 200) {
                console.log('Poll created successfully:', response.data);
            } else if (response.status === 405) {
                console.log('Invalid input:', response.data);
            } else {
                console.log('Unexpected response:', response);
            }
        } catch (error) {
            if (error.response) {
                const {status} = error.response;
                if (status === 400 || status === 405) {
                    console.log('Invalid input:', error.response.data);
                } else if (status === 404) {
                    console.log('Poll not found:', error.response.data);
                } else if (status === 410) {
                    console.log('Poll is gone:', error.response.data);
                } else {
                    console.log('Unexpected error:', error.response.data);
                }
            } else {
                console.log('Error:', error.message);
            }
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

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Options:</Form.Label>
                    {options.map((option, index) => (
                        <InputGroup className="mb-3" key={index}>
                            <FormControl
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                            />
                        </InputGroup>
                    ))}
                    <Button variant="outline-secondary" type="button" onClick={addOption}>
                        Add Option
                    </Button>
                </Form.Group>

                <Form.Group controlId="voices">
                    <Form.Label>Voices:</Form.Label>
                    <Form.Control
                        type="number"
                        value={voices}
                        onChange={(e) => setVoices(parseInt(e.target.value, 10))}
                    />
                </Form.Group>

                <Form.Group controlId="worst">
                    <Form.Check
                        type="checkbox"
                        label="Worst"
                        checked={worst}
                        onChange={(e) => setWorst(e.target.checked)}
                    />
                </Form.Group>

                <Form.Group controlId="deadline">
                    <Form.Label>Deadline:</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={deadline ? new Date(deadline).toISOString().substring(0, 16) : ''}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                </Form.Group>


                <Form.Group controlId="fixed">
                    <Form.Check
                        type="checkbox"
                        label="Fixed"
                        checked={fixed}
                        onChange={(e) => setFixed(e.target.checked)}
                    />
                </Form.Group>

                <Button type="submit">Create Poll</Button>
            </Form>
        </Container>
    );
};

export default CreatePoll;

