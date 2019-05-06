import React, { Component, useState } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  viewTestMeasure,
  studentFilefromCSV,
  gradeStudentTestMeasure,
  submitTestTask
} from "../../actions/evaluationsActions";
import {
  Table,
  Form,
  Container,
  OverlayTrigger,
  Tooltip,
  Collapse,
  Button
} from "react-bootstrap";
import "./Test.css";
// import classnames from "classnames";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import UploadFileButton from "../../common/UploadFileButton";
import { toastr } from "react-redux-toastr";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import SampleFile from "./students.csv";

import {
  faCheckCircle,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
library.add(faCheckCircle, faChevronDown);

class ViewTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gradeEdit: false,
      SubmitGrade: false,
      openFileUpload: false
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
      this.props.studentFilefromCSV(testMeasureId, data);
    } else {
      toastr.error("Error occured", "Please upload a file first");
    }
  };

  markAsComplete = () => {
    let { testMeasureId } = this.props.match.params;
    Swal.fire({
      title: "Are you sure?",
      text: "Your program coordinators will be notified!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark it!"
    }).then(result => {
      if (result.value) {
        this.props.submitTestTask(testMeasureId);
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  gradeStudentTestMeasure = (studentID, Score) => {
    let { testMeasureId } = this.props.match.params;
    if (Score) {
      this.props.gradeStudentTestMeasure(testMeasureId, studentID, Score);
    } else {
      this.props.gradeStudentTestMeasure(testMeasureId, studentID, "0");
    }
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
          <Container style={{ marginBottom: "50px" }}>
            <h2>
              {/* {test.hasSubmitted === "false" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Mark As Complete</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="mark-as-complete"
                    onClick={this.markAsComplete}
                  />
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Remark As Complete</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="marked-as-complete"
                    onClick={this.markAsComplete}
                  />
                </OverlayTrigger>
              )} */}

              {test.Test_Name}
            </h2>
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
            <div style={{ height: "200px" }}>
              <p
                onClick={() =>
                  this.setState({ openFileUpload: !this.state.openFileUpload })
                }
                aria-controls="example-collapse-text"
                aria-expanded={this.state.openFileUpload}
                class="text-center openFileUpload"
              >
                Upload a file instead <FontAwesomeIcon icon="chevron-down" />
              </p>
              <Collapse in={this.state.openFileUpload} className=" text-center">
                <div id="example-collapse-text">
                  <a href={SampleFile} className="download-file">
                    Download a sample file
                  </a>
                  <br />
                  <UploadFileButton
                    fileUploadHandler={this.fileUploadHandler}
                  />
                </div>
              </Collapse>
            </div>
            <div className="text-center">
              {test.hasSubmitted === "false" ? (
                <Button
                  variant="success"
                  size="lg"
                  onClick={this.markAsComplete}
                  className="mx-auto"
                >
                  Mark Evaluations Complete
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="lg"
                  onClick={this.markAsComplete}
                >
                  Remark Evaluations Complete
                </Button>
              )}
            </div>
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
    updateGrade(value);
    setTimeout(function() {
      props.gradeStudentTestMeasure(props.Student_ID, value);
    }, 1000);
    // if (e.target.value) {

    // } else {
    //   console.log(value);
    //   setTimeout(function() {
    //     props.gradeStudentTestMeasure(props.Student_ID, "0");
    //   }, 1000);
    // }
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
    gradeStudentTestMeasure,
    submitTestTask
  }
)(ViewTest);
