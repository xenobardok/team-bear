import React, { Component } from "react";
import { ListGroup, Row, Col, Card } from "react-bootstrap";
import { listAssignedRubrics } from "../../actions/evaluationsActions";
import { Link } from "react-router-dom";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Tasks extends Component {
  componentDidMount() {
    this.props.listAssignedRubrics();
  }

  render() {
    let { loading, allRubrics } = this.props.evaluations;
    let rubricsList;
    if (loading) {
      rubricsList = <Spinner />;
    } else {
      rubricsList = allRubrics.map(rubric => (
        <Link to={`/dashboard/tasks/rubric/${rubric.Rubric_ID}`}>
          <ListGroup.Item action key={rubric.Rubric_Name}>
            {rubric.Rubric_Name}
          </ListGroup.Item>
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
        </Row>
      </div>
    );
  }
}

Tasks.propTypes = {
  auth: PropTypes.object.isRequired,
  evaluations: PropTypes.object.isRequired,
  listAssignedRubrics: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  evaluations: state.evaluations
});

export default connect(
  mapStateToProps,
  { listAssignedRubrics }
)(Tasks);
