import { useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import PropTypes from 'prop-types';

const UpdateVote = ({ editToken, name, selectedChoice, voices }) => {
    const [updated, setUpdated] = useState(false);

    const updateVote = async () => {
        try {
            const response = await axios.put(
                `http://localhost:49706/vote/lack/${editToken}`,
                {
                    owner: {
                        name: name,
                    },
                    choice: selectedChoice,
                }
            );

            if (response.status === 200) {
                setUpdated(true);
                alert("Vote updated successfully");
            } else if (response.status === 404) {
                alert("Poll not found");
            } else {
                console.error("Unexpected response: " + JSON.stringify(response));
            }
        } catch (error) {
            console.error("Error: " + error.message);
        }
    };

    return (
        <Button
            variant="warning"
            disabled={name.length === 0 || selectedChoice.length !== voices || updated}
            onClick={updateVote}
        >
            Update Vote
        </Button>
    );
};

UpdateVote.propTypes = {
    editToken: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    selectedChoice: PropTypes.array.isRequired,
    voices: PropTypes.number.isRequired,
};

export default UpdateVote;
