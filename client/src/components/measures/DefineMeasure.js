import React, { Component } from "react";
import isEmpty from "../../validation/isEmpty";
import {
  Form,
  Badge,
  InputGroup,
  FormControl,
  Tooltip,
  OverlayTrigger
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
      Class_Name
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
      complete: true
    };
  }

  componentDidMount = prevProps => {
    this.setState({
      status: "editing"
    });
  };

  checkButtonHandler = e => {
    console.log(this.state.Class_Name);
    let measureValue = {
      Threshold: this.state.Threshold.toString(),
      Class_Name: this.state.Class_Name,
      Rubric_ID: this.state.rubric,
      Target: this.state.scale.toString()
    };
    console.log(measureValue);
    this.props.measureDefination(measureValue);
  };

  getScales = e => {
    console.log(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
    this.props.getSingleRubricScale(e.target.value);
  };

  editToggle = e => {
    this.setState({
      isEditing: !this.state.isEditing
    });
  };

  componentDidUpdate = prevProps => {
    let {
      Threshold,
      Rubric_Name,
      Target,
      allRubrics,
      rubricScales,
      Class_Name
    } = this.props;

    // if (this.props !== prevProps) {
    //   if (
    //     isEmpty(Threshold) ||
    //     isEmpty(Class_Name) ||
    //     isEmpty(Rubric_Name) ||
    //     isEmpty(Target)
    //   ) {
    //     this.setState({
    //       isEditing: true,
    //       complete: false
    //     });
    //   } else {
    //     this.setState({
    //       isEditing: false,
    //       complete: true
    //     });
    //   }
    // }

    if (
      this.props.Threshold !== prevProps.Threshold
      // isEmpty(this.state.Threshold)
    ) {
      this.setState({
        Threshold: this.props.Threshold
      });
    }

    if (this.props.Class_Name !== prevProps.Class_Name) {
      this.setState({
        Class_Name: this.props.Class_Name
      });
    }

    if (this.props.Rubric_Name !== prevProps.Rubric_Name) {
      this.setState({
        Rubric_Name: this.props.Rubric_Name
      });
    }

    if (this.props.Target !== prevProps.Target) {
      this.setState({
        Target: this.props.Target
      });
    }

    if (this.props.rubricScales !== prevProps.rubricScales) {
      this.setState({
        rubricScales: this.props.rubricScales
      });
    }
  };

  onChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
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
      complete
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

    if (this.props.Rubric_Name !== undefined) {
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
            <span> of students </span>
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
          </div>
        </Form>
      );
    }
    return <section>{measureDefination}</section>;
  }
}
