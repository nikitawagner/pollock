import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';

const UpdateVote = ({ token, options, onVoteUpdate }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleVoteUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:49706/vote/lack/${token}`, { options: selectedOptions });
            if (response.status === 200) {
                alert('Vote updated successfully');
                if (onVoteUpdate) {
                    onVoteUpdate();
                }
            } else {
                alert('Unexpected response:'+ response);
            }
        } catch (error) {
            console.error('Error updating vote:', error);
        }
    };

    return (
        <div>
            <h2>Update Vote</h2>
            <form onSubmit={handleVoteUpdate}>
                {options.map((option, index) => (
                    <div key={index}>
                        <label>
                            <input type="checkbox" checked={selectedOptions.includes(option.id)} onChange={(e) => {
                                const checked = e.target.checked;
                                setSelectedOptions((prevSelectedOptions) => {
                                    if (checked) {
                                        return [...prevSelectedOptions, option.id];
                                    } else {
                                        return prevSelectedOptions.filter((selectedOption) => selectedOption !== option.id);
                                    }
                                });
                            }} />
                            {option.text}
                        </label>
                    </div>
                ))}
                <button type="submit">Update Vote</button>
            </form>
        </div>
    );
};

UpdateVote.propTypes = {
    token: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onVoteUpdate: PropTypes.func,
};

export default UpdateVote;
