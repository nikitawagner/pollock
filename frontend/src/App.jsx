import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landingpage from "./components/Landingpage.jsx";
import NavbarTop from "./components/NavbarTop.jsx";
import CreatePoll from "./components/CreatePoll.jsx";
import EditPoll from "./components/EditPoll";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<BrowserRouter>
				<NavbarTop />
				<Routes>
					<Route exact path="/" element={<Landingpage />} />
					<Route exact path="/create" element={<CreatePoll />} />
					<Route exact path="/edit" element={<EditPoll />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
