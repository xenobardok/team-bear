import React, { Component } from "react";
import { Form, ListGroup, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/isEmpty";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateOutcome } from "../../actions/cycleActions";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faEdit);

class EditableOutcomeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      textValue: this.props.value.Outcome_Name,
      errors: {}
    };
  }

  editHandler = e => {
    let { isEditable } = this.state;
    this.setState({
      isEditable: !isEditable
    });
  };

  updateOutcomeButton = e => {
    this.props.updateOutcome(
      this.props.cycleID,
      this.props.value.Outcome_ID,
      this.state.textValue
    );
    if (isEmpty(this.state.errors)) {
      this.setState({
        isEditable: false
      });
    }
  };

  render() {
    let { isEditable } = this.state;
    console.log(this.props.value);
    return (
      <>
        {isEditable ? (
          <Form>
            <Form.Control
              type="text"
              value={this.state.textValue}
              onChange={e => this.setState({ textValue: e.target.value })}
            />
            <Button variant="primary" onClick={this.updateOutcomeButton}>
              Update
            </Button>
            <Button variant="secondary" onClick={this.editHandler}>
              Cancel
            </Button>
          </Form>
        ) : (
          <ListGroup key={this.props.value.Outcome_ID} className="edit-post">
            <ListGroup.Item
              action
              name={this.props.value.Outcome_ID}
              onClick={this.props.onClickHandler}
            >
              {this.state.textValue}
            </ListGroup.Item>
            <div
              style={{
                display: "inline",
                alignSelf: "center",
                padding: "0px 5px",
                cursor: "pointer"
              }}
              onClick={this.editHandler}
            >
              <FontAwesomeIcon icon="edit" />
            </div>
          </ListGroup>
        )}
      </>
    );
  }
}

EditableOutcomeList.propTypes = {
  updateOutcome: PropTypes.func.isRequired
};

export default connect(
  null,
  { updateOutcome }
)(EditableOutcomeList);
