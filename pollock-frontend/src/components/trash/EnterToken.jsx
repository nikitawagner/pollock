import { useNavigate } from 'react-router-dom';

const EnterToken = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = event.target.elements.token.value;
        navigate(`/user-poll/${token}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter Token:
                <input type="text" name="token" required />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default EnterToken;
