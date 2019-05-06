import React, { Component } from "react";
import { Container, Form, Button } from "react-bootstrap";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      // console.log(nextProps.errors);
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    // const user = {
    //   email: e.target.email.defaultValue,
    //   password: e.target.password.defaultValue
    // };

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(user);
  }
  render() {
    const { errors } = this.state;
    return (
      <Container
        className="login"
        style={{ margin: "100px auto", padding: "50px 50px 50px 50px" }}
      >
        <Form onSubmit={this.onSubmit}>
          <div className="text-center mb-4">
            <h2>Login</h2>
            <p>Enter your email address and password</p>
          </div>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              className={classnames("", { "is-invalid": errors.email })}
              autoComplete="on"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              className={classnames("", { "is-invalid": errors.password })}
              autoComplete="on"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
