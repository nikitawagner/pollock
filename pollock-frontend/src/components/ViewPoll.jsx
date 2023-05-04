import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewPoll = () => {
    const { token } = useParams();
    const [poll, setPoll] = useState(null);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await axios.get(`http://localhost:49706/poll/lack/${token}`);
                setPoll(response.data);
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };

        fetchPoll();
    }, [token]);

    if (!poll) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{poll.title}</h2>
            <p>{poll.description}</p>
            <ul>
                {poll.options.map((option, index) => (
                    <li key={index}>{option.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default ViewPoll;
