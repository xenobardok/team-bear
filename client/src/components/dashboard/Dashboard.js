import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";
import { logoutUser } from "../../actions/authActions";
import SideBar from "./SideBar";
import SimpleName from "./SimpleName";
import "../../App.css";

import Rubrics from "./Rubrics";

class Dashboard extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.getCurrentProfile();
    } else {
      this.props.history.push("/login");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.auth.isAuthenticated) {
      this.props.history.push("/login");
    }

    if (nextProps.errors) {
      console.log(nextProps.errors);
      this.setState({ errors: nextProps.errors });
    }
  }
  render() {
    return (
      <div id="outer-container">
        <SideBar />
        <main id="page-wrap">
          <Container>
            <h1>This is just a dashboard</h1>
            <Route path="/dashboard/rubrics" component={Rubrics} />
          </Container>
          <Route path={"/dashboard"} component={SimpleName} />
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, logoutUser }
)(Dashboard);
