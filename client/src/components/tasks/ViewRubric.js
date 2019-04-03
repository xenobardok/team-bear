import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  viewRubricMeasure,
  viewStudentGradeRubricMeasure,
  gradeStudentRubricMeasure
} from "../../actions/evaluationsActions";
import {
  Table,
  FormControl,
  Row,
  Col,
  Card,
  ListGroup,
  Button
} from "react-bootstrap";

import classnames from "classnames";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
// import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

let scalesRow, dataRow;

class ViewRubric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Student_ID: "",
      Student_Name: "",
      gradeEdit: false,
      Student_Grades: [],
      SubmitGrade: false
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
          Student_Grades: emptyArray
        });
      }
    }

    if (!isEmpty(this.state.Student_ID)) {
      if (this.state.Student_ID !== prevState.Student_ID) {
        console.log(
          this.props.match.params.rubricMeasureId,
          this.state.Student_ID
        );
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
        this.setState({
          Student_Grades: this.props.evaluations.studentGrade
        });
      }
    }
  };

  onChangeHandlerArray(index, e) {
    // console.log(e.target.value);

    const gradeIndex = index;
    const allGrades = [...this.state.Student_Grades];
    const updatedGrade = e.target.value;
    allGrades[gradeIndex] = updatedGrade;
    this.setState({ Student_Grades: allGrades });
    // console.log(gradeIndex);
  }

  studentClickHandler = (student, e) => {
    console.log(e);
    this.setState({
      Student_ID: student.Student_ID,
      Student_Name: student.Student_Name
    });
  };

  onSubmitGradeHandler = e => {
    let { rubricMeasureId } = this.props.match.params;
    this.props.gradeStudentRubricMeasure(
      rubricMeasureId,
      this.state.Student_ID,
      this.state.Student_Grades
    );
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
            <td className="borderedCell">
              <FormControl
                as="textarea"
                aria-label="With textarea"
                defaultValue={singleRow.Measure_Factor}
                className="measureTitle centerAlign cells"
                disabled
              />
            </td>
            {singleRow.Column_values.map(cell => (
              <td key={cell.Column_ID} className="borderedCell">
                <FormControl
                  as="textarea"
                  aria-label="With textarea"
                  defaultValue={cell.value}
                  className="cells"
                  disabled
                />
              </td>
            ))}
            {/* {console.log(this.state.Student_Grades[index])} */}
            {/* {!isEmpty(this.state.Student_Grades[index]) ? ( */}
            <td className="borderedCell">
              <FormControl
                name={"Student_Grades[" + index + "]"}
                as="textarea"
                aria-label="With textarea"
                value={this.state.Student_Grades[index]}
                className="measureTitle centerAlign cells"
                onChange={this.onChangeHandlerArray.bind(this, index)}
              />
            </td>
          </tr>
        ));
        displayRubric = (
          <div>
            <h2>{rubric.Rubric_Name}</h2>
            <h4 className="text-center">
              {isEmpty(this.state.Student_Name)
                ? "Please select a Student to grade:"
                : "Grading: " + this.state.Student_Name}
            </h4>
            <br />
            <Row>
              <Col md={9}>
                <Table bordered striped>
                  <thead>
                    <tr className="header">
                      <th
                        key="Criteria"
                        className="measureTitle centerAlign borderedCell"
                      >
                        Criteria
                      </th>
                      {scalesRow}
                      <th
                        key="Score"
                        className="measureTitle centerAlign borderedCell"
                      >
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>{dataRow}</tbody>
                </Table>
              </Col>
              <Col>
                <Card className="text-center">
                  <Card.Header>List of Students</Card.Header>
                  <Card.Body
                    style={{
                      padding: "0px",
                      height: "500px",
                      overflowY: "scroll"
                    }}
                  >
                    <ListGroup variant="flush">
                      {rubric.Students.map(student => (
                        <ListGroup.Item
                          key={student.Student_ID}
                          action
                          onClick={this.studentClickHandler.bind(this, student)}
                        >
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
                </Card>
              </Col>
            </Row>
          </div>
        );
      } else {
        displayRubric = <h2>Rubric not found!</h2>;
      }
    }
    return <div>{displayRubric}</div>;
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
    gradeStudentRubricMeasure
  }
)(ViewRubric);
