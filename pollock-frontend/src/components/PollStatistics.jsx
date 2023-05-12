import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from "prop-types";

const PollStatistics = ({ pollId }) => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {

        const fetchStatistics = async () => {
            try {
                const response = await axios.get(`http://localhost:49706/poll/lack/${pollId}`);
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching poll statistics:', error);
            }
        };

        (async () => {
            await fetchStatistics();
        })();
    }, [pollId]);

    if (!statistics) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Poll Statistics</h2>
            {statistics.options.map((option, index) => (
                <div key={index}>
                    {option.text}: {option.votes} votes
                </div>
            ))}
        </div>
    );
};

PollStatistics.propTypes = {
    pollId: PropTypes.string.isRequired,
};

export default PollStatistics;
