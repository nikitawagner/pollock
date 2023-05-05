import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CreatePoll from './components/CreatePoll';
import ViewPoll from './components/ViewPoll';
import UpdatePoll from './components/UpdatePoll';
import PollList from './components/PollList';
import PollResults from './components/PollResults';
import PollQuestions from './components/PollQuestions';
import PollSettings from './components/PollSettings';
import AppNavbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import ManagePolls from "./components/ManagePolls";

function App() {
	const [polls, setPolls] = useState([]);

	const handleDeletePoll = async (pollId) => {
		try {
			const response = await axios.delete(`http://localhost:49706/polls/${pollId}`);
			if (response.status === 200) {
				setPolls(polls.filter((poll) => poll.id !== pollId));
			} else {
				alert('Unexpected response:', response);
			}
		} catch (error) {
			alert('Error deleting poll:', error.message);
		}
	};

	const handleCreatePoll = async (pollData) => {
		try {
			const response = await axios.post('http://localhost:49706/polls', pollData);
			if (response.status === 200) {
				setPolls([...polls, response.data]);
			} else {
				alert('Unexpected response:', response);
			}
		} catch (error) {
			alert('Error creating poll:', error.message);
		}
	};

	const handleUpdatePoll = async (pollId, pollData) => {
		try {
			const response = await axios.put(`http://localhost:49706/polls/${pollId}`, pollData);
			if (response.status === 200) {
				setPolls(polls.map((poll) => (poll.id === pollId ? response.data : poll)));
			} else {
				alert('Unexpected response:', response);
			}
		} catch (error) {
			alert('Error updating poll:', error.message);
		}
	};

	return (
		<Router>
			<div className="App">
				<AppNavbar />
				<header className="App-header">
					<h1>Poll App</h1>
				</header>
				<main>
					<Routes>
						<Route path="/" element={<PollList polls={polls} />} />
						<Route path="/create-poll" element={<React.Fragment><CreatePoll handleCreatePoll={handleCreatePoll} /></React.Fragment>} />
						<Route path="/view-poll/:token" element={<ViewPoll PollResults={PollResults} PollQuestions={PollQuestions} PollSettings={PollSettings} handleDeletePoll={handleDeletePoll} />} />
						<Route path="/update-poll/:adminToken" element={<UpdatePoll handleUpdatePoll={handleUpdatePoll} />} />
						<Route path="/manage-polls/*" element={<ManagePolls />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
