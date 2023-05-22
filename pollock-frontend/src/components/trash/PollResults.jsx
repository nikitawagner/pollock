import PropTypes from 'prop-types';

const PollResults = ({ options }) => {
    const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);

    return (
        <div>
            <h2>Poll Results</h2>
            {options.map((option, index) => (
                <div key={index}>
                    {option.text}: {option.votes} votes ({((option.votes / totalVotes) * 100).toFixed(2)}%)
                </div>
            ))}
        </div>
    );
};

PollResults.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            votes: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default PollResults;
