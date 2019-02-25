import React, { Component } from "react";
import { Container, Form, Button, Col } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      password2: "",
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

    const newUser = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    // console.log(newEmail);

    axios
      .post("/api/users/register", newUser)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.onSubmit}>
          <div className="text-center mt-4 mb-4">
            <h2>Register</h2>
            <p>Enter your details as stated below</p>
          </div>
          <Form.Group>
            <Form.Row>
              <Col>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  placeholder="First name"
                  value={this.state.firstname}
                  name="firstname"
                  onChange={this.onChange}
                />
              </Col>
              <Col>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  placeholder="Last name"
                  value={this.state.lastname}
                  name="lastname"
                  onChange={this.onChange}
                />
              </Col>
            </Form.Row>
          </Form.Group>
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
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Enter a password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={this.state.password}
              name="password"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Enter your password again</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password again"
              value={this.state.password2}
              name="password2"
              onChange={this.onChange}
              className={classnames("", {
                "is-invalid": this.state.password !== this.state.password2
              })}
            />
            <Form.Control.Feedback type="invalid">
              Password do not match
            </Form.Control.Feedback>
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
