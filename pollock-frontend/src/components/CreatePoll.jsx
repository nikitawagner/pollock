
import PollForm from './PollForm';
import axios from "axios";
import {useState} from "react";

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['']);
    const [voices, setVoices] = useState(1);
    const [worst, setWorst] = useState(false);
    const [deadline, setDeadline] = useState(null);
    const [fixed, setFixed] = useState([]);
    const [adminToken, setAdminToken] = useState('');
    const [shareToken, setShareToken] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const pollData = {
            title,
            description,
            options: options.map((option) => ({ text: option })),
            setting: { voices, worst, deadline },
            fixed: fixed.map(option => ({ text: option })),
        };

        try {
            const response = await axios.post('http://localhost:49706/poll/lack', pollData);

            if (response.status === 200) {
                console.log("200 ok");
                alert('Poll created successfully: ' + JSON.stringify(response.data));
                setAdminToken(response.data.admin.value);
                setShareToken(response.data.share.value);
            } else {
                console.log("200 not OK")
                alert('Unexpected response: ' + JSON.stringify(response));
            }
        } catch (error) {
            console.log("Error: " + error.message)
            alert('Error: ' + error.message);
        }
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    return (
        <>
            <PollForm
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                options={options}
                setOptions={setOptions}
                voices={voices}
                setVoices={setVoices}
                worst={worst}
                setWorst={setWorst}
                deadline={deadline}
                setDeadline={setDeadline}
                fixed={fixed}
                setFixed={setFixed}
                handleSubmit={handleSubmit}
                buttonText="Create Poll"
                addOption={addOption}
                updateOption={updateOption}
            />
            {adminToken && shareToken && (
                <div>
                    <h3>Admin Token: {adminToken}</h3>
                    <h3>Share Token: {shareToken}</h3>
                </div>
            )}
        </>
    );
};

export default CreatePoll;
