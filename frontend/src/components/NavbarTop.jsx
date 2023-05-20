import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";

const NavbarTop = () => {
	let navigate = useNavigate();
	return (
		<Navbar bg="light" variant="light">
			<Container>
				<Navbar.Brand
					onClick={() => {
						navigate("/");
					}}
				>
					Pollack
				</Navbar.Brand>
				<Nav className="me-auto">
					<Nav.Link
						onClick={() => {
							navigate("/create");
						}}
					>
						UMFRAGE ERSTELLEN
					</Nav.Link>
					<Nav.Link
						onClick={() => {
							navigate("/edit");
						}}
					>
						UMFRAGE BEARBEITEN
					</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);
};

export default NavbarTop;
