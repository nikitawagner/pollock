import PropTypes from 'prop-types';

const PollSettings = ({ voices, setVoices, worst, setWorst, deadline, setDeadline, fixed, setFixed }) => {
    return (
        <div>
            <h2>Poll Settings</h2>
            <div>
                <label>
                    Number of Voices:
                    <input type="number" value={voices} min="1" max="100" onChange={(e) => setVoices(parseInt(e.target.value))} />
                </label>
            </div>
            <div>
                <label>
                    Allow Worst:
                    <input type="checkbox" checked={worst} onChange={(e) => setWorst(e.target.checked)} />
                </label>
            </div>
            <div>
                <label>
                    Deadline:
                    <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Fixed:
                    <input type="checkbox" checked={fixed} onChange={(e) => setFixed(e.target.checked)} />
                </label>
            </div>
        </div>
    );
};

PollSettings.propTypes = {
    voices: PropTypes.number.isRequired,
    setVoices: PropTypes.func.isRequired,
    worst: PropTypes.bool.isRequired,
    setWorst: PropTypes.func.isRequired,
    deadline: PropTypes.string,
    setDeadline: PropTypes.func.isRequired,
    fixed: PropTypes.bool.isRequired,
    setFixed: PropTypes.func.isRequired,
};

export default PollSettings;
