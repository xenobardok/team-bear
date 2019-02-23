import React, { Component } from "react";
import { Container, Form, Button } from "react-bootstrap";

class Register extends Component {
  render() {
    return (
      <Container>
        <Form method="POST" action="/">
          <div className="text-center mt-4 mb-4">
            <h2>Register</h2>
            <p>Enter your email address to begin</p>
          </div>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

export default Register;
