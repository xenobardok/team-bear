import React, { Component } from "react";
import { Jumbotron, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { recentCycle } from "../../actions/authActions";
import isEmpty from "../../validation/isEmpty";
import ViewLogs from "./ViewLogs";
class MainDashboard extends Component {
  componentDidMount() {
    this.props.recentCycle();
  }
  render() {
    let { auth } = this.props;
    let latestCycle = "";
    if (!isEmpty(auth.dashboard.Cycle_ID)) {
      latestCycle = (
        <Link to={`/dashboard/cycles/${auth.dashboard.Cycle_ID}`}>
          <div className="latestCycle">
            <p>{auth.dashboard.Cycle_Name}</p>
          </div>
        </Link>
      );
    } else {
      latestCycle = (
        <Link to={`/dashboard/cycles`}>
          <div className="latestCycle">
            <p>All Cycles</p>
          </div>
        </Link>
      );
    }

    let tasks = (
      <Link to={`/dashboard/tasks`}>
        <div className="latestCycle">
          <p>My Tasks</p>
        </div>
      </Link>
    );

    let adminTools = (
      <Link to={`/dashboard/programs`}>
        <div className="latestCycle">
          <p>Admin Tools</p>
        </div>
      </Link>
    );

    return (
      <div>
        <Jumbotron fluid>
          <Container>
            <h1>Hello {auth.user.firstname},</h1>
            {auth.user.isSuperUser === "false" ? (
              <>
                {auth.user.type === "Admin" ? (
                  <p>You are a coordinator of {auth.user.dept} department!</p>
                ) : (
                  <p>You are an evaluator of {auth.user.dept} department!</p>
                )}
              </>
            ) : (
              <p>Thank you for maintaining ULM Evaluations!</p>
            )}
          </Container>
        </Jumbotron>
        <Jumbotron fluid>
          {auth.user.isSuperUser === "false" ? (
            <>
              {auth.user.type === "Admin" ? (
                <Container>
                  <h5>Link to your recently working cycle:</h5>
                  {latestCycle}
                </Container>
              ) : (
                <Container>
                  <h5>Link to your tasks:</h5>
                  {tasks}
                </Container>
              )}
            </>
          ) : (
            <Container>
              <h5>Link to Admin Tools:</h5>
              {adminTools}
            </Container>
          )}
        </Jumbotron>

        <ViewLogs from="dashboard" />
      </div>
    );
  }
}

MainDashboard.propTypes = {
  recentCycle: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  logs: state.logs
});

export default connect(
  mapStateToProps,
  { recentCycle }
)(MainDashboard);
