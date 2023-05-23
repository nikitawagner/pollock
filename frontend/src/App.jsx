import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landingpage from "./components/Landingpage.jsx";
import NavbarTop from "./components/NavbarTop.jsx";
import CreatePoll from "./components/CreatePoll.jsx";
import EditPoll from "./components/EditPoll";
import EditVote from "./components/EditVote";
import PollResult from "./components/PollResult";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<BrowserRouter>
				<NavbarTop />
				<Routes>
					<Route exact path="/vote" element={<Landingpage />} />
					<Route exact path="/vote/edit" element={<EditVote />} />
					<Route exact path="/create" element={<CreatePoll />} />
					<Route exact path="/edit" element={<EditPoll />} />
					<Route exact path="/result" element={<PollResult />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
