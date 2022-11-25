import React, { useContext, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import { UserContext } from "../context/userContext";

export default function Login() {
    const [state, dispatch] = useContext(UserContext);

    const [message, setMessage] = useState(null);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const { email, password } = form;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const navigate = useNavigate();

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            const response = await API.post("/auth/login", form);
            console.log("aaaaaaaaaa",response);

            if (response?.status === 200) {
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: response.data,
                });

                if (response.data.user.role[0] === "admin") {
                    navigate("/");
                } else {
                    navigate("/login");
                }
            }
        } catch (error) {
            const alert = <Alert variant="danger">Login Failed</Alert>;
            setMessage(alert);
            console.log(error);
        }
    });

    return (
        <div>
            <Container>
                <div>
                    <Form onSubmit={(e) => handleSubmit.mutate(e)} className="myForm">
                        <h3>Login</h3>
                        {message}
                        <Form.Group className="mb-3">
                            <Form.Control
                                id="email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Group>
                        <Button type="submit" variant="secondary" style={{ width: "100%" }}>
                            Login
                        </Button>
                    </Form>
                </div>
            </Container>
        </div>
    );
}
