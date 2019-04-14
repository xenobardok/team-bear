import React, { Component } from "react";
import isEmpty from "../../validation/isEmpty";
import {
  Form,
  Badge,
  InputGroup,
  FormControl,
  Tooltip,
  OverlayTrigger,
  Row,
  Col
} from "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faCheck,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
library.add(faTimesCircle, faCheck, faEdit);

export default class DefineMeasure extends Component {
  constructor(props) {
    super(props);
    let {
      Threshold,
      Rubric_Name,
      Target,
      allRubrics,
      rubricScales,
      Class_Name,
      Test_Name,
      Test_Type
    } = this.props;

    this.state = {
      Threshold: Threshold,
      Rubric_Name: Rubric_Name,
      Target: Target,
      allRubrics: allRubrics,
      rubricScales: rubricScales,
      Class_Name: Class_Name,
      isEditing: false,
      rubric: "",
      scale: "",
      complete: true,
      Test_Name: Test_Name,
      Test_Type: "score"
    };
  }

  checkButtonHandler = e => {
    if (this.props.Measure_Type === "rubric") {
      let measureValue = {
        Threshold: this.state.Threshold.toString(),
        Class_Name: this.state.Class_Name,
        Rubric_ID: this.state.rubric,
        Target: this.state.scale.toString()
      };
      console.log(measureValue);
      this.setState({
        isEditing: false
      });
      this.props.measureDefination(measureValue);
    } else if (this.props.Measure_Type === "test") {
      let measureValue = {
        Threshold: this.state.Threshold.toString(),
        Target: this.state.Target.toString(),
        Test_Name: this.state.Test_Name,
        Test_Type: this.state.Test_Type
      };
      console.log(measureValue);
      this.setState({
        isEditing: false
      });
      this.props.measureDefination(measureValue);
    }
  };

  getScales = e => {
    console.log(e.target.name, e.target.value);
    this.setState({ rubric: e.target.value });
    this.props.getSingleRubricScale(e.target.value);
  };

  editToggle = e => {
    this.setState({
      isEditing: !this.state.isEditing
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    let {
      Threshold,
      Rubric_Name,
      Target,
      allRubrics,
      rubricScales,
      Class_Name,
      Test_Type,
      Measure_Type,
      Test_Name
    } = this.props;
    if (Threshold !== prevProps.Threshold) {
      if (Measure_Type === "rubric") {
        if (
          isEmpty(Threshold) ||
          isEmpty(Class_Name) ||
          isEmpty(Rubric_Name) ||
          isEmpty(Target)
        ) {
          this.setState({
            isEditing: true,
            complete: false
          });
        } else {
          this.setState({
            isEditing: false,
            complete: true
          });
        }
      } else if (Measure_Type === "test") {
        if (isEmpty(Threshold) || isEmpty(Target) || Test_Type === null) {
          this.setState({
            isEditing: true,
            complete: false
          });
        } else {
          this.setState({
            isEditing: false,
            complete: true
          });
        }
      }
    }

    if (
      Threshold !== prevProps.Threshold
      // isEmpty(this.state.Threshold)
    ) {
      this.setState({
        Threshold: Threshold
      });
    }

    if (Class_Name !== prevProps.Class_Name) {
      this.setState({
        Class_Name: Class_Name
      });
    }

    if (Rubric_Name !== prevProps.Rubric_Name) {
      this.setState({
        Rubric_Name: Rubric_Name
      });
    }

    if (Target !== prevProps.Target) {
      this.setState({
        Target: Target
      });
    }

    if (rubricScales !== prevProps.rubricScales) {
      this.setState({
        rubricScales: rubricScales
      });
    }

    if (Test_Name !== prevProps.Test_Name) {
      this.setState({
        Test_Name: Test_Name
      });
    }

    if (Test_Type !== this.state.Test_Type) {
      // console.log(T);
      if (Test_Type === null) {
        this.setState({
          Test_Type: "score"
        });
      } else {
        this.setState({
          Test_Type: Test_Type
        });
      }
    }
  };

  onChangeHandler = e => {
    if (
      this.props.Measure_Type === "test" &&
      this.state.Test_Type === "pass/fail" &&
      e.target.name === "Target"
    ) {
      console.log(e.target.value);
      this.setState({});
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleOptionChange = e => {
    this.setState({
      Test_Type: e.target.value
    });
  };
  render() {
    let {
      Threshold,
      Rubric_Name,
      Target,
      allRubrics,
      rubricScales,
      Class_Name,
      complete,
      Test_Name,
      Test_Type
    } = this.state;
    let measureDefination;
    let scaleOptions;
    if (!isEmpty(rubricScales)) {
      scaleOptions = rubricScales.map(entry => (
        <option value={entry.value} key={entry.value}>
          {entry.label}
          {" ("}
          {entry.value}
          {")"}
        </option>
      ));
    }

    if (this.props.Measure_Type) {
      measureDefination = (
        <Form>
          {this.state.isEditing ? (
            <>
              <OverlayTrigger
                key="cancel"
                placement="top"
                overlay={<Tooltip id="cancel">Cancel</Tooltip>}
              >
                <FontAwesomeIcon
                  icon="times-circle"
                  className="crossIcon"
                  onClick={this.editToggle}
                />
              </OverlayTrigger>
              <OverlayTrigger
                key="save"
                placement="top"
                overlay={<Tooltip id="save">Save Changes</Tooltip>}
              >
                <FontAwesomeIcon
                  icon="check"
                  className="checkIcon"
                  onClick={this.checkButtonHandler}
                />
              </OverlayTrigger>
            </>
          ) : (
            <OverlayTrigger
              key="save"
              placement="top"
              overlay={<Tooltip id="save">Edit Defination</Tooltip>}
            >
              <FontAwesomeIcon
                icon="edit"
                className="edit"
                onClick={this.editToggle}
              />
            </OverlayTrigger>
          )}
          <h5>
            Measure Definition{" "}
            {!complete ? (
              <Badge variant="warning">
                <span style={{ fontWeight: "400" }}>Incomplete</span>
              </Badge>
            ) : null}
          </h5>

          <div className="label-defination px-2">
            {this.state.isEditing && this.props.Measure_Type === "test" ? (
              <Form.Group as={Row} controlId="weightedRubric" className="px-2">
                <Form.Label column sm={2}>
                  Type of the Test?
                </Form.Label>
                <Col sm={10} style={{ display: "flex", alignItems: "center" }}>
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      id="customRadio1"
                      name="Test_Type"
                      className="custom-control-input"
                      value="score"
                      checked={Test_Type === "score"}
                      onChange={this.handleOptionChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customRadio1"
                    >
                      Score
                    </label>
                    &nbsp;&nbsp;
                  </div>
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      id="customRadio2"
                      name="Test_Type"
                      className="custom-control-input"
                      value="pass/fail"
                      checked={Test_Type === "pass/fail"}
                      onChange={this.handleOptionChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customRadio2"
                    >
                      Pass/Fail
                    </label>
                  </div>
                </Col>
              </Form.Group>
            ) : null}
            {!this.state.isEditing ? (
              <span>
                <strong>{Threshold}</strong> %
              </span>
            ) : (
              <InputGroup className="mb-3 small px-2">
                <FormControl
                  name="Threshold"
                  placeholder="Eg. 75"
                  aria-label="percentage"
                  aria-describedby="percentage"
                  value={this.state.Threshold}
                  onChange={this.onChangeHandler}
                />
                <InputGroup.Append>
                  <InputGroup.Text id="percentage">%</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            )}
            <span> of students</span>

            {this.props.Measure_Type === "rubric" ? (
              <>
                <span> in </span>
                {!this.state.isEditing ? (
                  <span>
                    <strong>{Class_Name}</strong>
                  </span>
                ) : (
                  <InputGroup className="mb-3 small px-2">
                    <FormControl
                      name="Class_Name"
                      placeholder="eg. BUSN 3005"
                      aria-label="coursename"
                      aria-describedby="coursename"
                      value={this.state.Class_Name}
                      onChange={this.onChangeHandler}
                    />
                  </InputGroup>
                )}
                <span> class evaluated on </span>
                {!this.state.isEditing ? (
                  <span>
                    <strong>{Rubric_Name}</strong> rubric
                  </span>
                ) : (
                  <InputGroup className="mb-3 rubric px-2">
                    <Form.Control
                      name="rubric"
                      as="select"
                      aria-describedby="rubric"
                      value={this.state.rubric}
                      onChange={this.getScales}
                    >
                      <option value="" disabled>
                        Choose one:
                      </option>
                      {allRubrics.map(entry => (
                        <option value={entry.Rubric_ID} key={entry.Rubric_ID}>
                          {entry.Rubrics_Name}
                        </option>
                      ))}
                    </Form.Control>
                    <InputGroup.Append>
                      <InputGroup.Text id="rubric">Rubric</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                )}
                <span> of </span>
                {!this.state.isEditing ? (
                  <span>
                    <strong>{Target}</strong>
                  </span>
                ) : (
                  <InputGroup className=" mb-3 target px-2">
                    <Form.Control
                      name="scale"
                      as="select"
                      aria-describedby="target"
                      value={this.state.scale}
                      onChange={this.onChangeHandler}
                    >
                      <option value="" disabled>
                        Choose a scale
                      </option>
                      {scaleOptions}
                    </Form.Control>
                  </InputGroup>
                )}
                <span> or better.</span>
              </>
            ) : (
              <>
                {this.state.Test_Type === "score" ? (
                  <>
                    <span> must receive </span>
                    {!this.state.isEditing ? (
                      <span>
                        <strong>{Target}</strong>
                      </span>
                    ) : (
                      <InputGroup className="mb-3 small px-2">
                        <FormControl
                          name="Target"
                          placeholder="eg. 50"
                          aria-label=""
                          aria-describedby="coursename"
                          value={this.state.Target}
                          onChange={this.onChangeHandler}
                        />
                      </InputGroup>
                    )}
                    <span> or more in </span>
                  </>
                ) : (
                  <>
                    <span> must </span>
                    {!this.state.isEditing ? (
                      <span>
                        <strong>
                          {Number(Target) === 1 ? <>Pass</> : <>Fail</>}
                        </strong>
                      </span>
                    ) : (
                      <InputGroup className="mb-3 small px-2">
                        <Form.Control
                          name="Target"
                          as="select"
                          onChange={this.onChangeHandler}
                          value={this.state.Target}
                        >
                          <option value="">Choose one:</option>
                          <option value="1">Pass</option>
                          <option value="0">Fail</option>
                        </Form.Control>
                      </InputGroup>
                    )}
                    <span> in </span>
                  </>
                )}

                {!this.state.isEditing ? (
                  <span>
                    <strong>{Test_Name}</strong>
                  </span>
                ) : (
                  <InputGroup className="mb-3 small px-2">
                    <FormControl
                      name="Test_Name"
                      placeholder="Eg: CSCI 4060 final"
                      aria-label=""
                      aria-describedby="coursename"
                      value={Test_Name}
                      onChange={this.onChangeHandler}
                    />
                  </InputGroup>
                )}
                <span> test.</span>
              </>
            )}
          </div>
        </Form>
      );
    }
    return <section>{measureDefination}</section>;
  }
}
