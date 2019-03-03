import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "../../App.css";
import { Dropdown } from "react-bootstrap";
import { logoutUser } from "../../actions/authActions";

class SimpleName extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    // this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    return (
      <Dropdown className="initial" alignRight>
        <Dropdown.Toggle id="dropdown-custom-components">
          Hello {this.props.auth.user.firstname}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={this.onLogoutClick.bind(this)}>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

SimpleName.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(SimpleName);
