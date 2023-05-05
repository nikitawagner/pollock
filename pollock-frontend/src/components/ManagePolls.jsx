import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {useEffect, useState} from "react";
import CreatePoll from "./CreatePoll.jsx";
import {Link, Outlet, useParams} from "react-router-dom";

const ManagePolls = () => {
    const [token, setToken] = useState("");
    const { token: urlToken } = useParams();

    useEffect(() => {
        if (urlToken) {
            setToken(urlToken);
        }
    }, [urlToken]);

    return (
        <Container>
            <h1>Manage Polls</h1>
            <Row>
                <Col>
                    <h2>Create Poll</h2>
                    <CreatePoll />
                </Col>
                <Col>
                    <h2>Update or Delete Poll</h2>
                    <Form>
                        <Form.Group controlId="token">
                            <Form.Label>Enter Poll Token:</Form.Label>
                            <Form.Control
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                            />
                        </Form.Group>
                        {token && (
                            <>
                                <Link to={`${token}/update`}>
                                    <Button variant="primary" className="mr-2">
                                        Update Poll
                                    </Button>
                                </Link>
                                <Link to={`${token}/delete`}>
                                    <Button variant="danger">Delete Poll</Button>
                                </Link>
                            </>
                        )}
                    </Form>
                </Col>
            </Row>
            {token && <Outlet />}
        </Container>
    );
};

export default ManagePolls;

