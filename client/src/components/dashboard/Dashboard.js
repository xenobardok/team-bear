import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";
import { logoutUser } from "../../actions/authActions";
import SideBar from "./SideBar";
import SimpleName from "./SimpleName";
import "../../App.css";

import Rubrics from "./Rubrics";
import CreateRubric from "./CreateRubric";
import ShowRubric from "./ShowRubric";

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
          <Route path={"/dashboard"} component={SimpleName} />
          <Container>
            {/* <h1>This is just a dashboard</h1>  */}
            <br />
            <br />
            <br />
            <br />
            <Route exact path="/dashboard/rubrics" component={Rubrics} />
            <Route
              exact
              path="/dashboard/rubrics/create"
              component={CreateRubric}
            />
            <Route
              exact
              path="/dashboard/rubrics/:id(\d+)"
              component={ShowRubric}
            />
          </Container>
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
