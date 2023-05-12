import PropTypes from 'prop-types';

const PollQuestions = ({ questions, setQuestions }) => {
    const addQuestion = () => {
        setQuestions([...questions, '']);
    };

    const updateQuestion = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    return (
        <div>
            <h2>Poll Questions</h2>
            {questions.map((question, index) => (
                <div key={index}>
                    <label>
                        Question {index + 1}:
                        <input type="text" value={String(question)} onChange={(e) => updateQuestion(index, e.target.value)} />
                    </label>
                </div>
            ))}
            <button type="button" onClick={addQuestion}>Add Question</button>
        </div>
    );
};

PollQuestions.propTypes = {
    questions: PropTypes.array.isRequired,
    setQuestions: PropTypes.func.isRequired,
};

export default PollQuestions;
