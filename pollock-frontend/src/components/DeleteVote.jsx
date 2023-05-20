import axios from 'axios';
import PropTypes from 'prop-types';

const DeleteVote = ({ token, onVoteDelete }) => {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:49706/vote/lack/${token}`);
            if (response.status === 200) {
                alert('Vote deleted successfully');
                if (onVoteDelete) {
                    onVoteDelete();
                }
            } else {
                alert('Unexpected response:'+ response);
            }
        } catch (error) {
            console.error('Error deleting vote:', error);
        }
    };

    return (
        <button onClick={handleDelete}>Delete Vote</button>
    );
};

DeleteVote.propTypes = {
    token: PropTypes.string.isRequired,
    onVoteDelete: PropTypes.func,
};

export default DeleteVote;
