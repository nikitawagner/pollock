import PollDetails from './PollDetails.jsx';
import { useParams } from 'react-router-dom';

const UserPoll = () => {
    const { token } = useParams();

    return (
        <div>
            <h1>User Poll</h1>
            <PollDetails shareToken={token} />
        </div>
    );
};

export default UserPoll;
