import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CreatePoll from './components/CreatePoll';
import ViewPoll from './components/trash/ViewPoll.jsx';
import UpdatePoll from './components/UpdatePoll';
//import PollList from './components/trash/PollList.jsx';
import PollResults from './components/trash/PollResults.jsx';
//import PollQuestions from './components/trash/PollQuestions.jsx';
//import PollSettings from './components/trash/PollSettings.jsx';
import AppNavbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import ManagePolls from "./components/ManagePolls";
import UserPoll from "./components/trash/UserPoll.jsx";
import EnterToken from "./components/trash/EnterToken.jsx";
import VoteForm from "./components/trash/VoteForm.jsx";
import Landingpage from "./components/LandingPage.jsx";

function App() {
	const [polls, setPolls] = useState([]);
	const [options] = useState([]);
	const [token] = useState("");
	const [adminToken] = useState("");


	const handleDeletePoll = async (adminToken) => {
		try {
			const response = await axios.delete(`http://localhost:49706/poll/lack/${adminToken}`);
			if (response.status === 200) {
				setPolls(polls.filter((poll) => poll.adminToken !== adminToken));
			} else {
				alert('Unexpected response:'+ response);
			}
		} catch (error) {
			alert('Error deleting poll:'+ error.message);
		}
	};

	const handleCreatePoll = async (pollData) => {
		try {
			const response = await axios.post('http://localhost:49706/poll/lack', pollData);
			if (response.status === 200) {
				setPolls([...polls, response.data]);
			} else {
				alert('Unexpected response:'+ response);
			}
		} catch (error) {
			alert('Error creating poll:'+ error.message);
		}
	};

	const handleUpdatePoll = async (adminToken, pollData) => {
		try {
			const response = await axios.put(`http://localhost:49706/poll/lack/${adminToken}`, pollData);
			if (response.status === 200) {
				setPolls(polls.map((poll) => (poll.adminToken === adminToken ? response.data : poll)));
			} else {
				alert('Unexpected response:'+ response);
			}
		} catch (error) {
			alert('Error updating poll:'+ error.message);
		}
	};

	return (
		<Router>
			<div className="App">
				<AppNavbar />
{/*				<header className="App-header">
					<h1>Poll App</h1>
				</header>*/}
				<main>
					<Routes>
						<Route path="/create-poll" element={<CreatePoll handleCreatePoll={handleCreatePoll} />} />
						<Route path="/view-poll/:token" element={<ViewPoll PollResults={PollResults} handleDeletePoll={handleDeletePoll} />} />
						<Route path="/update-poll/:adminToken" element={<UpdatePoll adminToken={adminToken} handleUpdatePoll={handleUpdatePoll} />} />
						<Route path="/manage-polls/*" element={<ManagePolls adminToken={adminToken} handleCreatePoll={handleCreatePoll} handleUpdatePoll={handleUpdatePoll} handleDeletePoll={handleDeletePoll} />} 						/>
						<Route path="/enter-token" element={<EnterToken />} />
						<Route path="/vote" element={<VoteForm options={options} token={token} />} />
						<Route path="/landingpage" element={<Landingpage />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
