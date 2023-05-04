import { Form, Button, Container, InputGroup, FormControl } from 'react-bootstrap';
import PropTypes from "prop-types";

const PollForm = ({
                      title,
                      setTitle,
                      description,
                      setDescription,
                      options,
                      voices,
                      setVoices,
                      worst,
                      setWorst,
                      deadline,
                      setDeadline,
                      fixed,
                      setFixed,
                      handleSubmit,
                      addOption,
                      updateOption,
                  }) => {
    const renderOptions = () => {
        return options.map((option, index) => (
            <InputGroup className="mb-3" key={index}>
                <FormControl
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                />
            </InputGroup>
        ));
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
                    {renderOptions()}
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

                <Button type="submit">Umfrage erstelen</Button>
            </Form>
        </Container>
    );
};

PollForm.propTypes = {
    title: PropTypes.string.isRequired,
    setTitle: PropTypes.func.isRequired,
    description: PropTypes.string.isRequired,
    setDescription: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    voices: PropTypes.number.isRequired,
    setVoices: PropTypes.func.isRequired,
    worst: PropTypes.bool.isRequired,
    setWorst: PropTypes.func.isRequired,
    deadline: PropTypes.string,
    setDeadline: PropTypes.func.isRequired,
    fixed: PropTypes.bool.isRequired,
    setFixed: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    addOption: PropTypes.func.isRequired,
    updateOption: PropTypes.func.isRequired,
};

export default PollForm;