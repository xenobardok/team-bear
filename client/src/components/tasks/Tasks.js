import React, { Component } from "react";
import {
  ListGroup,
  Row,
  Col,
  Card,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import {
  listAssignedRubrics,
  listAssignedTests
} from "../../actions/evaluationsActions";
import { Link } from "react-router-dom";
import Spinner from "../../common/Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import isEmpty from "../../validation/isEmpty";
library.add(faCheckCircle, faTimesCircle);

class Tasks extends Component {
  componentDidMount() {
    this.props.listAssignedRubrics();
    this.props.listAssignedTests();
  }

  render() {
    let { loading, allRubrics, allTests } = this.props.evaluations;
    let rubricsList, testsList;
    if (loading) {
      rubricsList = <Spinner />;
      testsList = <Spinner />;
    } else {
      if (!isEmpty(allRubrics)) {
        rubricsList = allRubrics.map(rubric => (
          <ListGroup className="edit-post" key={rubric.Rubric_Name}>
            <div
              style={{
                display: "inline",
                alignSelf: "center",
                padding: "0px 10px 0px 15px",
                cursor: "pointer"
              }}
            >
              {rubric.hasSubmitted === "true" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Status: Submitted</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="status success"
                  />
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Status: Not Submitted</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="times-circle"
                    className="status fail"
                  />
                </OverlayTrigger>
              )}
            </div>
            <Link
              to={`/dashboard/tasks/rubric/${rubric.Rubric_Measure_ID}`}
              style={{ flexGrow: "1" }}
            >
              <ListGroup.Item action>{rubric.Rubric_Name}</ListGroup.Item>
            </Link>
          </ListGroup>
        ));
      } else {
        rubricsList = (
          <ListGroup.Item>You have no rubrics to grade!</ListGroup.Item>
        );
      }

      if (!isEmpty(allTests)) {
        testsList = allTests.map(test => (
          <ListGroup className="edit-post" key={test.Test_Measure_ID}>
            <div
              style={{
                display: "inline",
                alignSelf: "center",
                padding: "0px 10px 0px 15px",
                cursor: "pointer"
              }}
            >
              {test.hasSubmitted === "true" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Status: Submitted</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="status success"
                  />
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Status: Not Submitted</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="times-circle"
                    className="status fail"
                  />
                </OverlayTrigger>
              )}
            </div>
            <Link
              to={`/dashboard/tasks/test/${test.Test_Measure_ID}`}
              style={{ flexGrow: "1" }}
            >
              <ListGroup.Item action>{test.Test_Name}</ListGroup.Item>
            </Link>
          </ListGroup>
        ));
      } else {
        testsList = (
          <ListGroup.Item>You have no tests to grade!</ListGroup.Item>
        );
      }
    }
    return (
      <div>
        <h1>Tasks</h1>
        <br />
        <Row>
          <Col>
            <Card className="text-center">
              <Card.Header>Rubrics assigned to me</Card.Header>
              <Card.Body style={{ padding: "0px" }}>
                <ListGroup variant="flush">{rubricsList}</ListGroup>
              </Card.Body>
            </Card>
          </Col>
          {this.props.evaluations.allTests ? (
            <Col>
              <Card className="text-center">
                <Card.Header>Tests assigned to me</Card.Header>
                <Card.Body style={{ padding: "0px" }}>
                  <ListGroup variant="flush">{testsList}</ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ) : null}
        </Row>
      </div>
    );
  }
}

Tasks.propTypes = {
  auth: PropTypes.object.isRequired,
  evaluations: PropTypes.object.isRequired,
  listAssignedRubrics: PropTypes.func.isRequired,
  listAssignedTests: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  evaluations: state.evaluations
});

export default connect(
  mapStateToProps,
  { listAssignedRubrics, listAssignedTests }
)(Tasks);
