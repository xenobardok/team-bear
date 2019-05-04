import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  viewRubricMeasure,
  viewStudentGradeRubricMeasure,
  gradeStudentRubricMeasure,
  submitRubricTask
} from "../../actions/evaluationsActions";
import {
  Table,
  FormControl,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Alert,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import classnames from "classnames";
import { toastr } from "react-redux-toastr";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
library.add(faCheckCircle, faExclamationCircle);

let scalesRow, dataRow;

class ViewRubric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Student_ID: "",
      Student_Name: "",
      gradeEdit: false,
      Student_Grades: [],
      SubmitGrade: false,
      rubricScale: [],
      Weighted_Grades: []
    };
  }

  componentDidMount() {
    if (this.props.match.params.rubricMeasureId) {
      this.props.viewRubricMeasure(this.props.match.params.rubricMeasureId);
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.Student_Name !== prevState.Student_Name) {
      this.setState({
        SubmitGrade: true
      });
    }

    // console.log(this.props.evaluations.rubric.data);
    if (!isEmpty(this.props.evaluations.rubric)) {
      if (
        this.props.evaluations.rubric.data.length !==
        this.state.Student_Grades.length
      ) {
        console.log("Adding empty array");
        let length = this.props.evaluations.rubric.data.length;
        let emptyArray = [];
        for (let i = 0; i < length; i++) {
          emptyArray.push(0);
        }
        this.setState({
          Student_Grades: emptyArray,
          Weighted_Grades: emptyArray
        });
      }
    }

    if (!isEmpty(this.state.Student_ID)) {
      if (this.state.Student_ID !== prevState.Student_ID) {
        // console.log(
        //   this.props.match.params.rubricMeasureId,
        //   this.state.Student_ID
        // );
        this.props.viewStudentGradeRubricMeasure(
          this.props.match.params.rubricMeasureId,
          this.state.Student_ID
        );
      }
    }

    if (this.props.evaluations.studentGrade) {
      if (
        this.props.evaluations.studentGrade !==
        prevProps.evaluations.studentGrade
      ) {
        // console.log(this.props.evaluations.studentGrade.score);
        let newWeightArray = [];
        this.props.evaluations.studentGrade.score.map((score, index) =>
          newWeightArray.push(
            (score * this.state.weight[index].Rubric_Row_Weight) / 100
          )
        );
        this.setState({
          Student_Grades: this.props.evaluations.studentGrade.score,
          Weighted_Grades: newWeightArray
        });
      }
    }

    if (!isEmpty(this.props.evaluations.rubric)) {
      if (this.props.evaluations.rubric !== prevProps.evaluations.rubric) {
        console.log("creating new scales array");
        let newScale = [];
        this.props.evaluations.rubric.Scale.forEach(element => {
          newScale.push(element.value);
        });
        this.setState({
          rubricScale: newScale
        });

        let newWeight = [];
        this.props.evaluations.rubric.data.forEach(element => {
          newWeight.push({
            Rubric_Row_ID: element.Rubric_Row_ID,
            Rubric_Row_Weight: element.Rubric_Row_Weight
          });
        });

        this.setState({
          weight: newWeight
        });
      }
    }

    // if (
    //   this.props.evaluations.rubric.data !== prevProps.evaluations.rubric.data
    // ) {
    //   console.log(this.props.evaluations.rubric.data);
  };

  onChangeHandlerArray(index, e) {
    let value = Number(e.target.value);
    this.changeStudentGrade(index, value);
  }

  changeStudentGrade(index, value) {
    if (!isEmpty(this.state.Student_ID)) {
      const re = /^[0-9\b]+$/;
      // console.log(e.target.value);
      if (
        value === 0 ||
        (re.test(value) && this.state.rubricScale.includes(value))
      ) {
        /* For Grade */
        const gradeIndex = index;
        const allGrades = [...this.state.Student_Grades];
        const updatedGrade = value;
        allGrades[gradeIndex] = updatedGrade;

        /* For Grade Weight */
        const allWeightValues = [...this.state.Weighted_Grades];
        const updatedWeight =
          (value * this.state.weight[index].Rubric_Row_Weight) / 100;
        allWeightValues[index] = updatedWeight;

        this.setState({
          Student_Grades: allGrades,
          Weighted_Grades: allWeightValues
        });
        // console.log(gradeIndex);
      }
    } else {
      toastr.info("Please select a student first!");
    }
  }

  studentClickHandler = (student, e) => {
    this.setState({
      Student_ID: student.Student_ID,
      Student_Name: student.Student_Name
    });
  };

  onSubmitGradeHandler = e => {
    let { rubricMeasureId } = this.props.match.params;
    if (this.state.Student_Grades.includes(0)) {
      toastr.info("Cannot give a zero grade");
    } else {
      this.props.gradeStudentRubricMeasure(
        rubricMeasureId,
        this.state.Student_ID,
        this.state.Student_Grades
      );
    }
  };

  boxClickHandler = (index, rowIndex, e) => {
    let value = this.state.rubricScale[rowIndex];
    this.changeStudentGrade(index, value);
  };

  markAsComplete = () => {
    let { rubricMeasureId } = this.props.match.params;
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
        this.props.submitRubricTask(rubricMeasureId);
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  render() {
    let { rubric, loading } = this.props.evaluations;
    let displayRubric = "";
    if (loading || isEmpty(rubric)) {
      displayRubric = <Spinner />;
    } else {
      // Check if logged in user has rubrics to view
      if (rubric) {
        scalesRow = rubric.Scale.map(singleValue => (
          <th key={singleValue.value} className="centerAlign borderedCell">
            {singleValue.label + " (" + singleValue.value + ")"}
          </th>
        ));

        dataRow = rubric.data.map((singleRow, index) => (
          <tr key={singleRow.Rubric_Row_ID}>
            <td className="borderedCell measureTitle centerAlign">
              {/* <FormControl
                as="textarea"
                aria-label="With textarea"
                defaultValue={singleRow.Measure_Factor}
                className="measureTitle centerAlign cells"
                disabled
              /> */}
              {singleRow.Measure_Factor}
            </td>
            {singleRow.Column_values.map((cell, rowIndex) => (
              <td
                key={cell.Column_ID}
                className="borderedCell cells"
                onClick={this.boxClickHandler.bind(this, index, rowIndex)}
              >
                {/* <FormControl
                  as="textarea"
                  aria-label="With textarea"
                  defaultValue={cell.value}
                  className="cells"
                  disabled
                /> */}
                <pre>{cell.value}</pre>
              </td>
            ))}
            <td className="borderedCell grade centerAlign">
              {/* <FormControl
                name={"Student_Grades[" + index + "]"}
                as="textarea"
                aria-label="With textarea"
                value={this.state.Student_Grades[index]}
                className="grade centerAlign cells"
                onChange={this.onChangeHandlerArray.bind(this, index)}
              /> */}
              {this.state.Student_Grades[index]}
            </td>
            {rubric.isWeighted === "true" ? (
              <>
                <td className="borderedCell grade centerAlign">
                  {/* <FormControl
                  name={"Student_Grades[" + index + "]"}
                  as="textarea"
                  aria-label="With textarea"
                  value={this.state.Weighted_Grades[index]}
                  className="grade centerAlign cells"
                  disabled
                /> */}
                  {this.state.Weighted_Grades[index]}
                </td>
                <td className="borderedCell grade centerAlign">
                  {singleRow.Rubric_Row_Weight}
                </td>
              </>
            ) : null}
          </tr>
        ));
        displayRubric = (
          <div
            style={{
              margin: "0px auto",
              maxWidth: "1600px",
              marginBottom: "100px"
            }}
          >
            <h2>
              {/* {rubric.hasSubmitted === "false" ? (
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
              {rubric.Rubric_Name}
            </h2>
            <h5>
              {isEmpty(this.state.Student_Name) ? (
                <Alert variant="info" className="text-center">
                  Please select a student to start grading
                </Alert>
              ) : (
                <Alert variant="primary" className="text-center">
                  Grading: <strong>{this.state.Student_Name}</strong>
                </Alert>
              )}
            </h5>
            <Row>
              <Col xs={9}>
                <Table bordered striped className="grade-table">
                  <thead>
                    <tr className="header">
                      <th className="measureTitle centerAlign borderedCell">
                        Criteria
                      </th>
                      {scalesRow}
                      <th className="grade centerAlign borderedCell">Score</th>
                      {rubric.isWeighted === "true" ? (
                        <>
                          <th className="grade centerAlign borderedCell">WS</th>
                          <th className="grade centerAlign borderedCell">%</th>
                        </>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>{dataRow}</tbody>
                </Table>
              </Col>
              <Col xs={3}>
                <Card className="text-center students">
                  <Card.Header>List of Students</Card.Header>
                  <Card.Body
                    style={{
                      padding: "0px",
                      maxHeight: "600px",
                      overflowY: "scroll"
                    }}
                  >
                    <ListGroup variant="flush">
                      {rubric.Students.map(student => (
                        <ListGroup.Item
                          key={student.Student_ID}
                          action
                          onClick={this.studentClickHandler.bind(this, student)}
                          className={classnames("", {
                            active: this.state.Student_ID === student.Student_ID
                          })}
                        >
                          {student.hasGraded ? (
                            <OverlayTrigger
                              placement="left"
                              overlay={<Tooltip>Student Graded</Tooltip>}
                            >
                              <FontAwesomeIcon
                                icon="check-circle"
                                className="marked-as-complete"
                              />
                            </OverlayTrigger>
                          ) : (
                            <OverlayTrigger
                              placement="left"
                              overlay={<Tooltip>Student Pending</Tooltip>}
                            >
                              <FontAwesomeIcon
                                icon="exclamation-circle"
                                className="marked-as-complete status pending"
                              />
                            </OverlayTrigger>
                          )}
                          &nbsp;&nbsp;
                          {student.Student_Name} : {student.Student_ID}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                  <Card.Footer>
                    {this.state.SubmitGrade ? (
                      <Button
                        variant="primary"
                        size="lg"
                        block
                        onClick={this.onSubmitGradeHandler}
                      >
                        Submit Grade
                      </Button>
                    ) : (
                      <Button variant="primary" size="lg" block disabled>
                        Submit Grade
                      </Button>
                    )}
                  </Card.Footer>
                  <Card.Footer>
                    {rubric.hasSubmitted === "false" ? (
                      <Button
                        variant="success"
                        size="lg"
                        block
                        onClick={this.markAsComplete}
                      >
                        Mark Evaluations Complete
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        size="lg"
                        block
                        onClick={this.markAsComplete}
                      >
                        Remark Evaluations Complete
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </div>
        );
      } else {
        displayRubric = <h2>Rubric not found!</h2>;
      }
    }
    return <div style={{ margin: "0px auto" }}>{displayRubric}</div>;
  }
}

// export default ViewRubric;
ViewRubric.propTypes = {
  viewRubricMeasure: PropTypes.func.isRequired,
  viewStudentGradeRubricMeasure: PropTypes.func.isRequired,
  gradeStudentRubricMeasure: PropTypes.func.isRequired,
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
    viewRubricMeasure,
    viewStudentGradeRubricMeasure,
    gradeStudentRubricMeasure,
    submitRubricTask
  }
)(ViewRubric);
