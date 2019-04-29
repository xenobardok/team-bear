import React, { Component } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  logoutUser,
  changeName,
  changePassword
} from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";
import NameDropdown from "./NameDropdown";
import EditProfile from "./EditProfile";
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false
    };
  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  };

  showModal = e => {
    this.setState({
      modalShow: true
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <Nav>
        <Navbar.Text>
          <NameDropdown
            firstname={user.firstname}
            lastname={user.lastname}
            logoutUser={this.onLogoutClick}
            showModal={this.showModal}
          />
        </Navbar.Text>
      </Nav>
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
    let modalClose = () => this.setState({ modalShow: false });
    return (
      <>
        <Navbar>
          <Container>
            <Link to="/dashboard" style={{ paddingLeft: "55px" }}>
              <Navbar.Brand>ULM Evaluations</Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto" />
              {isAuthenticated ? authLinks : guestLinks}
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <EditProfile
          onHide={modalClose}
          show={this.state.modalShow}
          firstname={user.firstname}
          lastname={user.lastname}
          changeName={this.props.changeName}
          changePassword={this.props.changePassword}
        />
      </>
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
  { logoutUser, clearCurrentProfile, changeName, changePassword }
)(NavBar);
