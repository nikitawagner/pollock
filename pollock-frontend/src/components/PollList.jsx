import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PollList = ({ isAdmin }) => {
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await axios.get('http://localhost:49706/polls');  // TODO: POllList wrong API!
                console.log('Fetched polls:', response.data);
                setPolls(response.data);
            } catch (error) {
                console.error('Error fetching polls:', error);
            }
        };

        (async () => {
            await fetchPolls();
        })();
    }, []);


    const handleDelete = async (pollToken) => {
        try {
            const response = await axios.delete(`http://localhost:49706/polls/${pollToken}`);
            if (response.status === 200) {
                setPolls(polls.filter((poll) => poll.token !== pollToken));
            } else {
                alert('Unexpected response:'+ response);
            }
        } catch (error) {
            console.error('Error deleting poll:', error);
        }
    };

    return (
        <div>
            <h2>Poll List</h2>
            {polls.map((poll) => (
                <div key={poll.id} className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">{poll.title}</h5>
                        <p className="card-text">{poll.description}</p>
                        <Link to={`/view-poll/${poll.token}`} className="btn btn-primary mr-2">
                            View Poll
                        </Link>
                        {isAdmin && (
                            <>
                                <Link to={`/update-poll/${poll.adminToken}`} className="btn btn-warning mr-2">
                                    Update Poll
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(poll.token)}
                                >
                                    Delete Poll
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

PollList.propTypes = {
    isAdmin: PropTypes.bool,
};

export default PollList;
