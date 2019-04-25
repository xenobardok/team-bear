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
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
// import ThreeDotOM from "./ThreeDotOM";
import ThreeDotCycle from "./ThreeDotCycle";
library.add(faPlus, faEdit, faCheckCircle, faTimesCircle);

class EditableOutcomeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      textValue: this.props.value.Outcome_Name,
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
        textValue: this.props.value.Outcome_Name
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
      this.state.textValue
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
          <Form>
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
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Status: Failing</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="times-circle"
                    className="status fail"
                  />
                </OverlayTrigger>
              )}
            </div>
            <Link
              to={`/dashboard/cycles/${this.props.cycleID}/outcome/${
                this.props.value.Outcome_ID
              }`}
              style={{ flexGrow: "1" }}
            >
              <ListGroup.Item action name={this.props.value.Outcome_ID}>
                {this.state.textValue}
              </ListGroup.Item>
            </Link>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit Outcome</Tooltip>}
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
