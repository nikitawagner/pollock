import { useEffect, useState } from 'react';
import axios from 'axios';
import Vote from './Vote.jsx';
import PropTypes from "prop-types";

const PollDetails = ({ shareToken }) => {
    const [poll, setPoll] = useState(null);
    const [error, setError] = useState(null);

    const fetchPoll = async () => {
        try {
            const response = await axios.get(`http://localhost:49706/poll/lack/${shareToken}`);
            if (response.status === 200) {
                setPoll(response.data);
            } else {
                setError('Unexpected response: ' + JSON.stringify(response));
            }
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchPoll();
    }, [shareToken]);

    const handleVote = () => {
        // Refetch the poll details after a vote is successfully submitted
        fetchPoll();
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!poll) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{poll.title}</h1>
            <p>{poll.description}</p>
            <Vote token={shareToken} options={poll.options} onVote={handleVote} />
        </div>
    );
};

PollDetails.propTypes = {
    shareToken: PropTypes.string.isRequired,
};

export default PollDetails;
