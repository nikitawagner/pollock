import axios from 'axios';
import { useState } from 'react';
import PropTypes from "prop-types";

const Vote = ({ pollId }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleVote = async () => {
        try {
            const response = await axios.post(`/api/polls/${pollId}/vote`, { optionId: selectedOption });
            if (response.status === 200) {
                alert('Vote submitted successfully');
            } else {
                alert('Unexpected response:', response);
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    };

    return (
        <div>
            <h2>Vote</h2>
            <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                <option value="">Select an option</option>
                {/* Replace the options array with the fetched poll options */}
                {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                    <option key={index} value={index}>
                        {option}
                    </option>
                ))}
            </select>
            <button onClick={handleVote}>Submit Vote</button>
        </div>
    );
};

Vote.propTypes = {
    pollId: PropTypes.string.isRequired,
};
export default Vote;