import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TakePoll from './TakePoll';
import PollStatistics from './PollStatistics';

const UserPoll = () => {
    const { token } = useParams();
    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = () => {
        setHasVoted(true);
    };

    return (
        <div>
            <TakePoll pollId={token} onVote={handleVote} />
            {hasVoted && <PollStatistics pollId={token} />}
        </div>
    );
};

export default UserPoll;
