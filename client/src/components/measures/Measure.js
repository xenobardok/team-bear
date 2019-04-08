import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Badge,
  OverlayTrigger,
  Tooltip,
  InputGroup,
  FormControl,
  Form,
  Button,
  Col,
  Row,
  Dropdown,
  DropdownButton,
  Alert
} from "react-bootstrap";
import { getEvaluators } from "../../actions/profileActions";
import {
  getSingleMeasure,
  assignEvaluatorToMeasure,
  defineMeasure,
  addStudent,
  removeStudent,
  addStudentsFromCSV
} from "../../actions/measureActions";
import { getRubrics, getSingleRubric } from "../../actions/rubricsActions";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import EvaluatorBox from "./EvaluatorBox";
import Stats from "./Stats";
import DefineMeasure from "./DefineMeasure";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import EditableStudentList from "./EditableStudentList";
import { toastr } from "react-redux-toastr";
import "./measure.css";
library.add(faPlus, faEdit, faUserPlus);

class Measure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      newEvaluator: false,
      allEvaluators: [],
      rubricScales: [],
      addStudentBox: false,
      Student_Name: "",
      Student_ID: "",
      fileUpload: false,
      uploadedFile: null,
      unevaluatedStudents: null
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props.measures.singleMeasure) {
      console.log(
        this.props.measures.singleMeasure !==
          prevProps.measures.singleMeasure &&
          !isEmpty(this.props.measures.singleMeasure)
      );
      // console.log(this.props.measures.singleMeasure);
      if (
        this.props.measures.singleMeasure !==
          prevProps.measures.singleMeasure &&
        !isEmpty(this.props.measures.singleMeasure)
      ) {
        let { singleMeasure } = this.props.measures;
        this.setState({
          Measure_ID: singleMeasure.Measure_ID,
          Measure_Label: singleMeasure.Measure_Label,
          Measure_Type: singleMeasure.Measure_Type,
          Target: singleMeasure.Target,
          Threshold: singleMeasure.Threshold,
          Achieved_Threshold: singleMeasure.Achieved_Threshold,
          Is_Success: singleMeasure.Is_Success,
          Total_Students: singleMeasure.Total_Students,
          Student_Achieved_Target_Count:
            singleMeasure.Student_Achieved_Target_Count,
          Evaluators: singleMeasure.Evaluators,
          Students: singleMeasure.Students,
          Rubric_Name: singleMeasure.Rubric_Name,
          Class_Name: singleMeasure.Class_Name
        });
      }
    }

    if (this.props.profile.evaluators !== prevProps.profile.evaluators) {
      console.log(this.props.profile.evaluators);
      this.setState({
        allEvaluators: this.props.profile.evaluators
      });
    }

    if (this.props.rubrics.allRubrics !== prevProps.rubrics.allRubrics) {
      this.setState({
        allRubrics: this.props.rubrics.allRubrics
      });
    }

    if (this.props.rubrics.rubric !== prevProps.rubrics.rubric) {
      this.setState({
        rubricScales: this.props.rubrics.rubric.Scale
      });
    }
  };

  onChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    let { outcomeID, measureID } = this.props.match.params;
    this.props.getSingleMeasure(outcomeID, measureID);
    this.props.getEvaluators();
    this.props.getRubrics();
  }

  getSingleRubricScale = id => {
    this.props.getSingleRubric(id);
  };

  addEvaluator = () => {
    this.setState({
      newEvaluator: !this.state.newEvaluator
    });
  };

  addButtonEvaluator = email => {
    console.log(this.props.match.params.measureID, email);
    if (!isEmpty(email)) {
      this.props.assignEvaluatorToMeasure(
        this.props.match.params.measureID,
        email
      );

      this.setState({ newEvaluator: false });
    }
  };

  measureDefination = defination => {
    let { outcomeID, measureID } = this.props.match.params;
    // console.log("Reached defineMeasure method");
    this.props.defineMeasure(outcomeID, measureID, defination);
  };

  toggleAddStudentButton = e => {
    this.setState({
      addStudentBox: !this.state.addStudentBox
    });
  };

  toggleAddStudentsFromFileButton = e => {
    this.setState({
      addStudentBox: !this.state.addStudentBox,
      fileUpload: true
    });
  };

  addStudentButton = e => {
    let student = {
      Student_Name: this.state.Student_Name,
      Student_ID: this.state.Student_ID
    };
    let { measureID } = this.props.match.params;
    this.props.addStudent(measureID, student);
    this.setState({
      addStudentBox: !this.state.addStudentBox
    });
  };

  fileUploadHandler = e => {
    const data = new FormData();
    data.append("students", this.state.uploadedFile);
    this.props.addStudentsFromCSV(this.state.Measure_ID, data);
    this.setState({
      fileUpload: false,
      uploadedFile: null
    });
  };
  removeStudentButton = Student_ID => {
    this.props.removeStudent(this.state.Measure_ID, Student_ID);
  };

  getUnevaluatedStudents = (name, e) => {
    let newStudentList = {};
    this.props.measures.singleMeasure.Unevaluated.forEach(element => {
      if (element.Evaluator_Name === name) {
        newStudentList.Evaluator_Name = name;
        newStudentList.students = [...element.Student_List];
      }
    });
    this.setState({
      unevaluatedStudents: newStudentList
    });
  };

  closeUnevaluated = () => {
    this.setState({
      unevaluatedStudents: null
    });
  };
  render() {
    let newEvaluatorBox;
    let { loading, singleMeasure } = this.props.measures;
    let {
      Measure_Label,
      Measure_Type,
      Target,
      Threshold,
      Achieved_Threshold,
      Is_Success,
      Evaluators,
      Students,
      Rubric_Name,
      End_Date,
      Total_Students,
      Student_Achieved_Target_Count,
      newEvaluator,
      Class_Name,
      addStudentBox,
      Measure_ID,
      fileUpload
    } = this.state;

    let measure;
    if (newEvaluator) {
      newEvaluatorBox = (
        <EvaluatorBox
          addEvaluator={this.addEvaluator}
          values={this.state.allEvaluators}
          addButtonEvaluator={this.addButtonEvaluator}
        />
      );
    }
    if (loading || isEmpty(singleMeasure)) {
      measure = <Spinner />;
    } else {
      measure = (
        <div>
          <div className="measure-label">
            <Badge variant="primary">
              <span style={{ fontWeight: "400" }}>Measure Label</span>
            </Badge>
            <br />
            <h3>{Measure_Label ? Measure_Label : null}</h3>
          </div>
          <br />
          <DefineMeasure
            Threshold={Threshold}
            Rubric_Name={Rubric_Name}
            Target={Target}
            allRubrics={this.state.allRubrics}
            getSingleRubricScale={this.getSingleRubricScale}
            rubricScales={this.state.rubricScales}
            Class_Name={Class_Name}
            measureDefination={this.measureDefination}
          />
          <br />
          <Stats
            Achieved_Threshold={Achieved_Threshold}
            Is_Success={Is_Success}
            Total_Students={Total_Students}
            Student_Achieved_Target_Count={Student_Achieved_Target_Count}
          />
          <br />

          <section id="evaluators">
            <span style={{ float: "right", fontSize: "1.25rem" }}>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={<Tooltip id="add-evaluator">Add Evaluator</Tooltip>}
              >
                <FontAwesomeIcon
                  icon="user-plus"
                  onClick={this.addEvaluator}
                  className="addEvaluatorIcon"
                />
              </OverlayTrigger>
            </span>
            <h5>Evaluators</h5>
            <div className="evaluators">
              {Evaluators
                ? Evaluators.map(value => (
                    <EvaluatorBox
                      key={value.Evaluator_Name}
                      {...value}
                      getUnevaluatedStudents={this.getUnevaluatedStudents}
                    />
                  ))
                : null}

              {newEvaluatorBox}
            </div>
          </section>
          <br />
          <h5>Students</h5>
          <Row>
            <Col sm={6}>
              <p>List of students:</p>
              <ol>
                {this.props.measures.studentsLoading ? (
                  <Spinner />
                ) : (
                  <>
                    {!isEmpty(Students) ? (
                      Students.map(value => (
                        <EditableStudentList
                          {...value}
                          key={value.Student_ID}
                          removeStudentButton={this.removeStudentButton}
                          Measure_ID={Measure_ID}
                        />
                      ))
                    ) : (
                      <p>No Students added to this measure yet!</p>
                    )}
                  </>
                )}
                <br />
                {!addStudentBox ? (
                  <DropdownButton
                    size="sm"
                    variant="primary"
                    title="Add Students"
                    id="student-add"
                    key="addStudentDropdown"
                  >
                    <Dropdown.Item
                      eventKey="1"
                      onClick={this.toggleAddStudentButton}
                    >
                      Add a Student
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="2"
                      onClick={this.toggleAddStudentsFromFileButton}
                    >
                      Upload a file
                    </Dropdown.Item>
                  </DropdownButton>
                ) : (
                  <>
                    {fileUpload ? (
                      <Form
                        onSubmit={this.fileUploadHandler}
                        encType="multipart/form-data"
                      >
                        <input
                          type="file"
                          name="students"
                          onChange={e =>
                            this.setState({ uploadedFile: e.target.files[0] })
                          }
                        />
                        <Button
                          variant="primary"
                          onClick={this.fileUploadHandler}
                        >
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Form onSubmit={this.addStudentButton}>
                        <InputGroup className="mb-3">
                          <FormControl
                            placeholder="Student name"
                            aria-label="Student name"
                            aria-describedby="basic-addon2"
                            name="Student_Name"
                            value={this.state.Student_Name}
                            onChange={this.onChangeHandler}
                          />
                          <FormControl
                            placeholder="ID"
                            aria-label="ID"
                            aria-describedby="basic-addon2"
                            name="Student_ID"
                            value={this.state.Student_ID}
                            onChange={this.onChangeHandler}
                          />
                          <InputGroup.Append>
                            <Button
                              variant="primary"
                              onClick={this.addStudentButton}
                            >
                              Add Student
                            </Button>

                            <Button
                              variant="outline-secondary"
                              onClick={this.toggleAddStudentButton}
                            >
                              Cancel
                            </Button>
                          </InputGroup.Append>
                        </InputGroup>
                      </Form>
                    )}
                  </>
                )}
              </ol>
            </Col>
            <Col sm={6}>
              {this.state.unevaluatedStudents === null ? (
                <Alert variant="warning">
                  Click on a evaluator to see the list of unevaluated students
                </Alert>
              ) : (
                <div>
                  <p>
                    <OverlayTrigger
                      key="c"
                      placement="top"
                      overlay={<Tooltip id="tooltip-top">Close</Tooltip>}
                    >
                      <FontAwesomeIcon
                        icon="times-circle"
                        className="crossIcon"
                        onClick={this.closeUnevaluated}
                      />
                    </OverlayTrigger>
                    Students yet to be evaluated by{" "}
                    {this.state.unevaluatedStudents.Evaluator_Name}
                    {": "}
                  </p>
                  <ol>
                    {this.state.unevaluatedStudents.students.map(student => (
                      <li>{student}</li>
                    ))}
                  </ol>
                </div>
              )}
            </Col>
          </Row>
        </div>
      );
    }
    return <Container className="single-measure">{measure}</Container>;
  }
}

Measure.propTypes = {
  getSingleMeasure: PropTypes.func.isRequired,
  measures: PropTypes.object.isRequired,
  getEvaluators: PropTypes.func.isRequired,
  defineMeasure: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  measures: state.measures,
  profile: state.profile,
  rubrics: state.rubrics
});

export default connect(
  mapStateToProps,
  {
    getSingleMeasure,
    getEvaluators,
    assignEvaluatorToMeasure,
    getRubrics,
    getSingleRubric,
    defineMeasure,
    addStudent,
    removeStudent,
    addStudentsFromCSV
  }
)(Measure);
