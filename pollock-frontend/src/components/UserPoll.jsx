import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TakePoll from './TakePoll';
import PollStatistics from './PollStatistics';

const UserPoll = () => {
    const { token: initialToken } = useParams();
    const [token, setToken] = useState(initialToken);
    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = () => {
        setHasVoted(true);
    };

    const handleTokenSubmit = (event) => {
        event.preventDefault();
        //ToDO: Should we validate the token somehow?
        setToken(event.target.tokenInput.value);
    };

    return (
        <div>
            {!token &&
                <form onSubmit={handleTokenSubmit}>
                    <label>
                        Enter share token:
                        <input type="text" name="tokenInput" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            }
            {token &&
                <>
                    <TakePoll pollId={token} onVote={handleVote} />
                    {hasVoted && <PollStatistics pollId={token} />}
                </>
            }
        </div>
    );
};

export default UserPoll;
