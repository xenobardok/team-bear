import React, { Component, useState } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  viewTestMeasure,
  studentFilefromCSV,
  gradeStudentTestMeasure
} from "../../actions/evaluationsActions";
import { Table, Form, Container } from "react-bootstrap";
import "./Test.css";
// import classnames from "classnames";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import UploadFileButton from "../../common/UploadFileButton";
import { toastr } from "react-redux-toastr";

class ViewTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gradeEdit: false,
      SubmitGrade: false
    };
  }

  componentDidMount() {
    let { testMeasureId } = this.props.match.params;
    if (testMeasureId) {
      this.props.viewTestMeasure(testMeasureId);
    }
  }

  componentDidUpdate = (prevProps, prevState) => {};

  fileUploadHandler = file => {
    let { testMeasureId } = this.props.match.params;
    if (file) {
      const data = new FormData();
      data.append("StudentsGrade", file);
      console.log(testMeasureId, file);
      this.props.studentFilefromCSV(testMeasureId, data);
    } else {
      toastr.error("Error occured", "Please upload a file first");
    }
  };

  gradeStudentTestMeasure = (studentID, Score) => {
    let { testMeasureId } = this.props.match.params;
    console.log(testMeasureId, studentID, Score);
    this.props.gradeStudentTestMeasure(testMeasureId, studentID, Score);
  };
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
                <tr className="text-center">
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {test.StudentsData.map((value, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{value.Student_ID}</td>
                    <td>{value.Student_Name}</td>
                    <td>
                      <EditableSingleGrade
                        {...value}
                        gradeStudentTestMeasure={this.gradeStudentTestMeasure}
                        Test_Type={test.Test_Type}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr class="hr-text" data-content="OR" />
            <UploadFileButton fileUploadHandler={this.fileUploadHandler} />
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
  let onChangeHandler = e => {
    let value = e.target.value;
    updateGrade(Number(value));
    if (e.target.value) {
      console.log(value);
      setTimeout(function() {
        props.gradeStudentTestMeasure(props.Student_ID, value);
      }, 1000);
    } else {
      console.log(value);
      setTimeout(function() {
        props.gradeStudentTestMeasure(props.Student_ID, "0");
      }, 1000);
    }
  };
  return (
    <Form>
      {props.Test_Type === "pass/fail" ? (
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Control as="select" value={grade} onChange={onChangeHandler}>
            <option value="0">Fail</option>
            <option value="1">Pass</option>
          </Form.Control>
        </Form.Group>
      ) : (
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Control
            type="number"
            placeholder="Eg. 75"
            value={grade}
            onChange={onChangeHandler}
          />
        </Form.Group>
      )}
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
    viewTestMeasure,
    studentFilefromCSV,
    gradeStudentTestMeasure
  }
)(ViewTest);
