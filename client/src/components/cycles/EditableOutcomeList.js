import React, { Component } from "react";
import {
  Form,
  ListGroup,
  Button,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
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

  render() {
    let { isEditable } = this.state;
    return (
      <>
        {isEditable ? (
          <Form>
            <Form.Control
              type="text"
              value={this.state.textValue}
              onChange={e => this.setState({ textValue: e.target.value })}
              className={classnames("", {
                "is-invalid": this.state.errors.Outcome_Name
              })}
            />
            <Form.Control.Feedback type="invalid">
              {this.state.errors.Outcome_Name}
            </Form.Control.Feedback>
            <Button variant="primary" onClick={this.updateOutcomeButton}>
              Update
            </Button>
            <Button variant="secondary" onClick={this.cancelHandler}>
              Cancel
            </Button>
          </Form>
        ) : (
          <ListGroup
            key={this.props.value.Outcome_ID}
            className="edit-post list-lines"
          >
            <div
              style={{
                display: "inline",
                alignSelf: "center",
                padding: "0px 15px",
                cursor: "pointer"
              }}
            >
              {this.props.value.Outcome_Success === "true" ? (
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Status: Passing</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="status success"
                  />
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="right"
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
                placement="right"
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

export default EditableOutcomeList;
