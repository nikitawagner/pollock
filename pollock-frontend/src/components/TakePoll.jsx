import { useParams } from 'react-router-dom';
import ViewPoll from './ViewPoll';
import PollResults from './PollResults';
import Vote from './Vote';

const TakePoll = () => {
    const { token } = useParams();

    return (
        <div>
            <ViewPoll token={token} />
            <PollResults token={token} options={[]} />
            <Vote token={token} pollId={"0"} />
        </div>
    );
};

export default TakePoll;
