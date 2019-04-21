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

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
// import ThreeDotOM from "./ThreeDotOM";
import ThreeDotCycle from "./ThreeDotCycle";

import classnames from "classnames";
library.add(faPlus, faEdit);

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
    let { outcomeID, measureID } = this.props;
    this.props.updateMeasureLabel(
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
              <Button variant="outline-danger" onClick={this.deleteHandler}>
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
                {this.state.Measure_Name}
              </ListGroup.Item>
            </Link>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit Measure</Tooltip>}
            >
              <div
                style={{
                  display: "flex",
                  alignSelf: "center",
                  padding: "0px 5px",
                  cursor: "pointer"
                }}
              >
                <ThreeDotCycle editHandler={this.editHandler} type="Measure" />
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
