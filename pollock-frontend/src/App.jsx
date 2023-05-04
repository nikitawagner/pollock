import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import CreatePoll from "./components/CreatePoll.jsx";
import ViewPoll from "./components/ViewPoll.jsx";
import UpdatePoll from "./components/UpdatePoll.jsx";
import AppNavbar from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
						<Route path="/view-poll/:token" element={<ViewPoll />} />
						<Route path="/update-poll/:adminToken" element={<UpdatePoll />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
