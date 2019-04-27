import React, { Component } from "react";
import Spinner from "../../common/Spinner";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSubmittedCycles } from "../../actions/cycleActions";
import classnames from "classnames";
import {
  ListGroup,
  Card,
  Button,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";

import isEmpty from "../../validation/isEmpty";
import ThreeDotReport from "./ThreeDotReport";

class MainReport extends Component {
  constructor() {
    super();

    this.state = { modalShow: false };
  }

  componentDidMount() {
    this.props.getSubmittedCycles();
  }
  render() {
    let { cycles, loading } = this.props.reports;

    let cyclesList = "";
    let newCycle;
    if (this.props.auth.user.type === "Admin") {
      if (cycles === null || loading) {
        cyclesList = <Spinner />;
      } else {
        //   Check if logged in user has cycles to view
        if (Object.keys(cycles).length > 0) {
          cyclesList = cycles.map(value => (
            <ListGroup key={value.Cycle_ID} className="edit-post">
              <Link
                to={"/dashboard/cycles/" + value.Cycle_ID}
                style={{ flexGrow: "1" }}
              >
                <ListGroup.Item action key={value.Cycle_ID}>
                  {value.Cycle_Name}
                </ListGroup.Item>
              </Link>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Options</Tooltip>}
              >
                <div
                  style={{
                    display: "flex",
                    alignSelf: "center",
                    cursor: "pointer"
                  }}
                >
                  <ThreeDotReport Cycle_ID={value.Cycle_ID} />
                </div>
              </OverlayTrigger>
            </ListGroup>
          ));
        } else {
          cyclesList = (
            <div>
              <br />
              <h4>There is no submitted cycles yet!</h4>
              <Link to="/dashboard">
                <Button variant="info">Return to Dashboard</Button>
              </Link>
              <br />
              <br />
            </div>
          );
        }
      }
    }
    return (
      <>
        <Card className="text-center report">
          <Card.Header>List of Submitted Cycles</Card.Header>
          <Card.Body style={{ padding: "0px" }}>
            <ListGroup variant="flush">{cyclesList}</ListGroup>
          </Card.Body>
        </Card>
      </>
    );
  }
}
MainReport.propTypes = {
  getSubmittedCycles: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  reports: state.reports
});

export default connect(
  mapStateToProps,
  { getSubmittedCycles }
)(MainReport);
