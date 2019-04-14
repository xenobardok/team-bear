import React, { Component, useState } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { viewTestMeasure } from "../../actions/evaluationsActions";
import { Table, Form, Container } from "react-bootstrap";

// import classnames from "classnames";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";

class ViewTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Student_ID: "",
      Student_Name: "",
      gradeEdit: false,
      Student_Grades: [],
      SubmitGrade: false,
      rubricScale: []
    };
  }

  componentDidMount() {
    let { testMeasureId } = this.props.match.params;
    if (testMeasureId) {
      this.props.viewTestMeasure(testMeasureId);
    }
  }

  componentDidUpdate = (prevProps, prevState) => {};

  render() {
    let { test, loading } = this.props.evaluations;
    let displayTest = "";
    if (loading || isEmpty(test)) {
      displayTest = <Spinner />;
    } else {
      // Check if logged in user has rubrics to view
      if (test) {
        displayTest = (
          <Container>
            <h2>{test.Test_Name}</h2>
            <Table striped bordered hover className="test">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {test.StudentsData.map((value, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{value.Student_ID}</td>
                    <td>{value.Student_Name}</td>
                    <td>
                      <EditableSingleGrade {...value} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        );
      } else {
        displayTest = <h2>Rubric not found!</h2>;
      }
    }
    return <div style={{ margin: "0px auto" }}>{displayTest}</div>;
  }
}

const EditableSingleGrade = props => {
  let [grade, updateGrade] = useState(props.Grade);

  return (
    <Form>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Control
          type="number"
          placeholder="Eg. 75"
          value={grade}
          onChange={e => updateGrade(Number(e.target.value))}
        />
      </Form.Group>
    </Form>
  );
};

// export default ViewRubric;
ViewTest.propTypes = {
  viewTestMeasure: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  evaluations: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  evaluations: state.evaluations
});

export default connect(
  mapStateToProps,
  {
    viewTestMeasure
  }
)(ViewTest);
