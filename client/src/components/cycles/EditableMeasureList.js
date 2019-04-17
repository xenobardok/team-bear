import React, { Component } from "react";
import {
  Form,
  ListGroup,
  Card,
  Button,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faEdit);

class EditableMeasureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      Measure_Name: this.props.value.Measure_Name
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
              name="Measure_Name"
              type="text"
              as="textarea"
              rows="2"
              value={this.state.Measure_Name}
              onChange={this.onChangeHandler}
            />
            <Button variant="primary" onClick={this.updateMeasureLabel}>
              Update
            </Button>
            <Button variant="secondary" onClick={this.editHandler}>
              Cancel
            </Button>
          </Form>
        ) : (
          <ListGroup key={this.props.value.Measure_ID} className="edit-post">
            <div
              style={{
                display: "inline",
                alignSelf: "center",
                padding: "0px 15px",
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
            <div
              style={{
                display: "inline",
                alignSelf: "center",
                padding: "0px 5px",
                cursor: "pointer"
              }}
            >
              <br />
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Edit Outcome</Tooltip>}
              >
                <FontAwesomeIcon
                  icon="edit"
                  className="edit"
                  onClick={this.editHandler}
                />
              </OverlayTrigger>
            </div>
          </ListGroup>
        )}
      </>
    );
  }
}

export default EditableMeasureList;
