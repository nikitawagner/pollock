import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Vote = ({ token, onVote }) => {
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get(`http://localhost:49706/vote/lack/${token}`);
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching poll options:', error);
            }
        };

        (async () => {
            await fetchOptions();
        })();
    }, [token]);

    const handleVote = async () => {
        try {
            const response = await axios.post(`http://localhost:49706/vote/lack/${token}`, { options: selectedOptions });
            if (response.status === 200) {
                alert('Vote submitted successfully');
                if (onVote) {
                    onVote();
                }
            } else {
                alert('Unexpected response:'+ response);
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    };

    return (
        <div>
            <h2>Vote</h2>
            <form onSubmit={handleVote}>
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
                <button type="submit">Submit Vote</button>
            </form>
        </div>
    );
};

Vote.propTypes = {
    token: PropTypes.string.isRequired,
    onVote: PropTypes.func,
};

export default Vote;
