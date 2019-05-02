import React, { Component } from "react";
import {
  Form,
  ListGroup,
  Button,
  OverlayTrigger,
  Tooltip,
  ButtonGroup
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
// import ThreeDotOM from "./ThreeDotOM";
import ThreeDotCycle from "./ThreeDotCycle";
library.add(faPlus, faEdit, faCheckCircle, faTimesCircle, faExclamationCircle);

class EditableOutcomeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      textValue: this.props.value.Outcome_Name,
      curriculumMap: this.props.value.Class_Factors,
      errors: {}
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props.errors) {
      if (prevProps.errors !== this.props.errors) {
        this.setState({
          errors: this.props.errors
        });
      }
    } else {
      this.setState({
        errors: ""
      });
    }
    if (this.props.errors !== prevProps.errors) {
      // if (isEmpty(this.props.errors)) {
      //   this.setState({
      //     isEditable: false
      //   });
      // }
      // console.log(this.props.errors);
    }

    if (this.props.value !== prevProps.value) {
      this.setState({
        textValue: this.props.value.Outcome_Name,
        curriculumMap: this.props.value.Class_Factors
      });
    }
  };

  editHandler = e => {
    let { isEditable } = this.state;
    this.setState({
      isEditable: !isEditable,
      errors: ""
    });
  };

  cancelHandler = e => {
    let { isEditable } = this.state;
    this.setState({
      isEditable: !isEditable,
      errors: "",
      textValue: this.props.value.Outcome_Name
    });
    // this.props.getSingleCycle(this.props.cycleID);
  };

  updateOutcomeButton = e => {
    this.props.updateOutcome(
      this.props.cycleID,
      this.props.value.Outcome_ID,
      this.state.textValue,
      this.state.curriculumMap
    );
  };
  deleteButtonHandler = () => {
    let { cycleID, value } = this.props;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        console.log(cycleID, value.Outcome_ID);
        this.props.deleteOutcome(cycleID, value.Outcome_ID);
        this.editHandler();
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  render() {
    let { isEditable } = this.state;
    return (
      <>
        {isEditable ? (
          <Form className="create">
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Name of the outcome:</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={this.state.textValue}
                onChange={e => this.setState({ textValue: e.target.value })}
                className={classnames("mt-1 ml-1 mr-1", {
                  "is-invalid": this.state.errors.Outcome_Name
                })}
              />
              <Form.Control.Feedback type="invalid">
                {this.state.errors.Outcome_Name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Curriculum Mapping</Form.Label>
              <Form.Control
                name="new-curriculum"
                as="textarea"
                aria-label="With textarea"
                value={this.state.curriculumMap}
                placeholder="(Optional) Curriculum responsible for this outcome"
                onChange={e => this.setState({ curriculumMap: e.target.value })}
                className={classnames("mt-1 ml-1 mr-1", {
                  "is-invalid": this.state.errors.Outcome_Name
                })}
              />
            </Form.Group>
            <ButtonGroup size="sm" className="mt-1 mb-1">
              <Button variant="primary" onClick={this.updateOutcomeButton}>
                Update
              </Button>
              <Button variant="secondary" onClick={this.cancelHandler}>
                Cancel
              </Button>
              <Button
                variant="outline-danger"
                onClick={this.deleteButtonHandler}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Form>
        ) : (
          <ListGroup
            key={this.props.value.Outcome_ID}
            // className="edit-post list-lines"
            className="edit-post"
          >
            <div
              style={{
                display: "inline",
                alignSelf: "center",
                padding: "0px 10px 0px 15px",
                cursor: "pointer"
              }}
            >
              {this.props.value.Outcome_Success === "true" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Status: Passing</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="status success"
                  />
                </OverlayTrigger>
              ) : null}
              {this.props.value.Outcome_Success === "false" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Status: Failing</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="times-circle"
                    className="status fail"
                  />
                </OverlayTrigger>
              ) : null}

              {this.props.value.Outcome_Success === "pending" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Status: Pending</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="exclamation-circle"
                    className="status pending"
                  />
                </OverlayTrigger>
              ) : null}
            </div>
            <Link
              to={`/dashboard/cycles/${this.props.cycleID}/outcome/${
                this.props.value.Outcome_ID
              }`}
              style={{ flexGrow: "1" }}
            >
              <ListGroup.Item action name={this.props.value.Outcome_ID}>
                {this.props.value.Outcome_Index}
                {". "}
                {this.state.textValue}
              </ListGroup.Item>
            </Link>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Options</Tooltip>}
            >
              <div
                style={{
                  display: "flex",
                  alignSelf: "center",
                  cursor: "pointer"
                }}
              >
                {/* <FontAwesomeIcon
                  icon="edit"
                  className="edit"
                  onClick={this.editHandler}
                /> */}
                <ThreeDotCycle
                  editHandler={this.editHandler}
                  type="Outcome"
                  Outcome_ID={this.props.value.Outcome_ID}
                  Is_Submitted={this.props.Is_Submitted}
                />
              </div>
            </OverlayTrigger>
          </ListGroup>
        )}
      </>
    );
  }
}

export default EditableOutcomeList;
