import React, { Component } from "react";
import { Container, Form, Button } from "react-bootstrap";

class Login extends Component {
  render() {
    return (
      <Container>
        <Form method="POST" action="/">
          <div className="text-center mt-4 mb-4">
            <h2>Login</h2>
            <p>Enter your email address and password</p>
          </div>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              required
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

export default Login;
