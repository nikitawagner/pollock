// DeletePoll.js
import { useState } from 'react';
import axios from 'axios';

const DeletePoll = () => {
    const [adminToken, setAdminToken] = useState('');
    const [deleted, setDeleted] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/polls/${adminToken}`);

            if (response.status === 200) {
                setDeleted(true);
            }
        } catch (error) {
            console.error('Error deleting poll:', error);
        }
    };

    if (deleted) {
        return <div>Umfrage gelöscht.</div>;
    }

    return (
        <div>
            <h2>Umfrage löschen</h2>
            <p>Geben Sie den Admin-Token für die Umfrage ein, die Sie löschen möchten:</p>
            <input
                type='text'
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
            />
            <button onClick={handleDelete}>Delete Poll</button>
        </div>
    );
};

export default DeletePoll;
