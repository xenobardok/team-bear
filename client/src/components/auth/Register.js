import React, { Component } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const newEmail = {
      email: this.state.email
    };

    // console.log(newEmail);

    axios
      .post("/api/users/register", newEmail)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.onSubmit}>
          <div className="text-center mt-4 mb-4">
            <h2>Register</h2>
            <p>Enter your email address to begin</p>
          </div>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email (@ulm.edu)"
              value={this.state.email}
              name="email"
              onChange={this.onChange}
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

export default Register;
