import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ViewPoll from './ViewPoll.jsx';
import PollResults from './PollResults.jsx';
import Vote from './Vote.jsx';

const TakePoll = () => {
    const { token } = useParams();
    const [poll, setPoll] = useState(null);
    const [options, setOptions] = useState([]);
    const [owner, setOwner] = useState(null);
    const [choices, setChoices] = useState([]);

    const fetchPoll = async () => {
        try {
            const response = await axios.post(`http://localhost:49706/vote/lack/${token}`);
            const { poll, vote } = response.data;
            setPoll(poll.body);
            setOptions(poll.body.options);
            setOwner(vote.owner);
            setChoices(vote.choice);
        } catch (error) {
            console.error("Error fetching poll data:", error);
            if (error.response && error.response.status === 404) {
                alert('Poll not found');
            }
        }
    };

    useEffect(() => {
        fetchPoll();
    }, [token]);

    const handleVote = () => {
        fetchPoll();
    };

    return (
        <div>
            <ViewPoll poll={poll} owner={owner} choices={choices}/>
            <PollResults options={options} />
            <Vote token={token} options={options} onVote={handleVote} />
        </div>
    );
};

export default TakePoll;
