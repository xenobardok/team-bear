import React, { Component } from "react";
import { Container, Form, Button, Col } from "react-bootstrap";
import classnames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { registerUser } from "../../actions/authActions";
import axios from "axios";
import { Redirect } from "react-router";
class Register extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      password2: "",
      tempCode: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  // componentDidMount() {
  //   if (this.props.auth.isAuthenticated) {
  //     this.props.history.push("/dashboard");
  //   }
  // }
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
    this.props.registerUser(newUser, this.props.history);
  }

  componentDidUpdate = prevProps => {
    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
    }
  };

  render() {
    return (
      <Container
        className="login"
        style={{ margin: "100px auto", padding: "50px 50px 50px 50px" }}
      >
        <Form onSubmit={this.onSubmit}>
          <div className="text-center mb-4">
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
                  className={classnames("", {
                    "is-invalid": this.state.errors.firstname
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors.firstname}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  placeholder="Last name"
                  value={this.state.lastname}
                  name="lastname"
                  onChange={this.onChange}
                  className={classnames("", {
                    "is-invalid": this.state.errors.lastname
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors.lastname}
                </Form.Control.Feedback>
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
              className={classnames("", {
                "is-invalid": this.state.errors.email
              })}
            />
            <Form.Control.Feedback type="invalid">
              {this.state.errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Enter a password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={this.state.password}
              name="password"
              onChange={this.onChange}
              className={classnames("", {
                "is-invalid": this.state.errors.password
              })}
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">
              {this.state.errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formBasicPassword2">
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
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">
              Password do not match
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formtempCode">
            <Form.Label>
              Enter your temporary code sent to your email
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Temp Code"
              value={this.state.tempCode}
              name="tempCode"
              onChange={this.onChange}
              className={classnames("", {
                "is-invalid": this.state.errors.tempCode
              })}
            />
            <Form.Control.Feedback type="invalid">
              Temp Code does not match
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  reports: state.reports
});

export default connect(
  mapStateToProps,
  { registerUser }
)(Register);
