import React, { Component } from "react";
import { ListGroup, Row, Col, Card } from "react-bootstrap";
import {
  listAssignedRubrics,
  listAssignedTests
} from "../../actions/evaluationsActions";
import { Link } from "react-router-dom";
import Spinner from "../../common/Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
      rubricsList = allRubrics.map(rubric => (
        <Link
          to={`/dashboard/tasks/rubric/${rubric.Rubric_Measure_ID}`}
          key={rubric.Rubric_Name}
        >
          <ListGroup.Item action>{rubric.Rubric_Name}</ListGroup.Item>
        </Link>
      ));
      testsList = allTests.map(test => (
        <Link
          to={`/dashboard/tasks/test/${test.Test_Measure_ID}`}
          key={test.Test_Measure_ID}
        >
          <ListGroup.Item action>{test.Test_Name}</ListGroup.Item>
        </Link>
      ));
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
