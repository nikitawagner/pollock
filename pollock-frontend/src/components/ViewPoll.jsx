import PropTypes from 'prop-types';

const ViewPoll = ({ poll }) => {
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

ViewPoll.propTypes = {
    poll: PropTypes.object,
};

export default ViewPoll;
