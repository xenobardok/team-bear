import React, { Component } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

class NavBar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <Nav>
        <Navbar.Text>Hi, {user.firstname}</Navbar.Text>
        <Nav.Link href="#" onClick={this.onLogoutClick.bind(this)}>
          Logout?
        </Nav.Link>
      </Nav>
      // <Nav>
      //   <Nav.Link>Hi, {user.firstname}</Nav.Link>
      //   <Nav.Link href="#" onClick={this.onLogoutClick.bind(this)}>
      //     Logout?
      //   </Nav.Link>
      // </Nav>
    );

    const guestLinks = (
      <Nav className="login-register">
        <Link to="/login">
          <Navbar.Text>Login</Navbar.Text>
        </Link>
        <Link to="/register">
          <Navbar.Text>Register</Navbar.Text>
        </Link>
      </Nav>
    );

    return (
      <Navbar>
        <Container>
          <Link to="/" style={{ paddingLeft: "55px" }}>
            <Navbar.Brand>ULM Evaluations</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" />
            {isAuthenticated ? authLinks : guestLinks}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

NavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(NavBar);
