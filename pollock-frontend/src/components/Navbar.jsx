import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" style={{ width: '100%', zIndex: 1000 }}>
            <Navbar.Brand>
                <Link to="/" className="navbar-brand">
                    Poll App
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Item>
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/manage-polls" className="nav-link">
                            Manage Polls
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/enter-token" className="nav-link">
                            User Poll
                        </Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
