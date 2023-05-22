import { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';

const VoteForm = ({ options, token }) => {
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [isWorst, setIsWorst] = useState(false);
    const [ownerName, setOwnerName] = useState('');
    const [editToken, setEditToken] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const voteData = {
            owner: {
                name: ownerName,
            },
            choice: [
                {
                    id: selectedOptionId,
                    worst: isWorst,
                },
            ],
        };

        try {
            const response = await axios.post(`http://localhost:49706/vote/lack/${token}`, voteData);

            if (response.status === 200) {
                setEditToken(response.data.edit.value);
                alert('Vote cast successfully. Your edit token is: ' + response.data.edit.value);
            } else {
                alert('Unexpected response: ' + JSON.stringify(response));
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Your Name:
                <input
                    type="text"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                />
            </label>
            {options.map((option, index) => (
                <div key={index}>
                    <input
                        type="radio"
                        id={`option${option.id}`}
                        name="vote"
                        value={option.id}
                        onChange={() => setSelectedOptionId(option.id)}
                    />
                    <label htmlFor={`option${option.id}`}>{option.text}</label>
                </div>
            ))}
            <label>
                Mark as Worst:
                <input
                    type="checkbox"
                    name="worst"
                    checked={isWorst}
                    onChange={() => setIsWorst(!isWorst)}
                />
            </label>
            <Button type="submit">Vote</Button>
        </form>
    );
}

VoteForm.propTypes = {
    options: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired,
};

export default VoteForm;
