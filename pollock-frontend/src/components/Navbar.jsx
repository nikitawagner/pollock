import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" style={{ width: '100%', zIndex: 1000 }}>
            <Navbar.Brand as={Link} to="/">
                Poll App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link as={Link} to="/">
                        Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/manage-polls">
                    Manage Poll
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
