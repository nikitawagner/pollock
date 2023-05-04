import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CreatePoll from './components/CreatePoll';
import ViewPoll from './components/ViewPoll';
import UpdatePoll from './components/UpdatePoll';
import AppNavbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
	return (
		<Router>
			<div className="App">
				<AppNavbar />
				<header className="App-header">
					<h1>Create a Poll</h1>
				</header>
				<main>
					<Routes>
						<Route path="/" element={<CreatePoll />} />
						<Route path="/create-poll" element={<CreatePoll />} />
						<Route path="/view-poll/:token" element={<ViewPoll />} />
						<Route path="/update-poll/:adminToken" element={<UpdatePoll />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
