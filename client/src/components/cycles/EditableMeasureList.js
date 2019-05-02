import React, { Component } from "react";
import {
  Form,
  ListGroup,
  Card,
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
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
// import ThreeDotOM from "./ThreeDotOM";
import ThreeDotCycle from "./ThreeDotCycle";

import classnames from "classnames";
library.add(faPlus, faEdit, faExclamationCircle);

class EditableMeasureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      Measure_Name: this.props.value.Measure_Name,
      errors: {}
    };
  }

  editHandler = e => {
    let { isEditable } = this.state;
    this.setState({
      isEditable: !isEditable,
      Measure_Name: this.props.value.Measure_Name
    });
  };

  updateMeasureLabel = e => {
    e.preventDefault();
    let { id, outcomeID, measureID } = this.props;
    this.props.updateMeasureLabel(
      id,
      outcomeID,
      measureID,
      this.state.Measure_Name
    );

    this.setState({
      isEditable: !this.state.isEditable
    });
  };

  onChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  deleteButtonHandler = () => {
    let { id, outcomeID, measureID } = this.props;
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
        console.log(id, outcomeID, measureID);
        this.props.deleteMeasure(id, outcomeID, measureID);
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
          <Form onSubmit={this.updateMeasureLabel} style={{ padding: "10px" }}>
            <Form.Control
              rows="3"
              className={classnames("mt-1 ml-1 mr-1", {
                "is-invalid": this.state.errors.Measure_Name
              })}
              name="Measure_Name"
              type="text"
              as="textarea"
              value={this.state.Measure_Name}
              onChange={this.onChangeHandler}
            />
            <Form.Control.Feedback type="invalid">
              {this.state.errors.Measure_Name}
            </Form.Control.Feedback>
            <ButtonGroup size="sm" className="mt-1 mb-1">
              <Button variant="primary" onClick={this.updateMeasureLabel}>
                Update
              </Button>
              <Button variant="secondary" onClick={this.editHandler}>
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
          <ListGroup key={this.props.value.Measure_ID} className="edit-post">
            <div
              style={{
                display: "inline",
                alignSelf: "center",
                padding: "0px 10px 0px 15px",
                cursor: "pointer"
              }}
            >
              {this.props.value.Measure_Success === "true" ? (
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
              {this.props.value.Measure_Success === "false" ? (
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
              {this.props.value.Measure_Success === "pending" ? (
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
              to={
                "/dashboard/cycles/" +
                this.props.id +
                "/outcome/" +
                this.props.outcomeID +
                "/" +
                this.props.value.Measure_ID
              }
              style={{ flexGrow: "1" }}
            >
              <ListGroup.Item action key={this.props.value.Measure_ID}>
                {this.props.Outcome_Index}
                {"."}
                {this.props.value.Measure_Index}
                {". "}
                {this.state.Measure_Name}
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
                  padding: "0px 5px",
                  cursor: "pointer"
                }}
              >
                <ThreeDotCycle
                  editHandler={this.editHandler}
                  type="Measure"
                  Is_Submitted={this.props.Is_Submitted}
                  Measure_ID={this.props.value.Measure_ID}
                  Measure_type={this.props.value.Measure_type}
                />
                {/* <FontAwesomeIcon
                  icon="edit"
                  className="edit"
                  onClick={this.editHandler}
                /> */}
              </div>
            </OverlayTrigger>
          </ListGroup>
        )}
      </>
    );
  }
}

export default EditableMeasureList;
