import React, { Component } from "react";
import { Form, ListGroup, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faEdit);

class EditableMeasureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false
    };
  }

  editHandler = e => {
    let { isEditable } = this.state;
    this.setState({
      isEditable: !isEditable
    });
  };

  render() {
    let { isEditable } = this.state;

    return (
      <>
        {isEditable ? (
          <Form>
            <Form.Control
              type="text"
              defaultValue={this.props.value.Measure_Name}
            />
            <Button variant="primary">Update</Button>
            <Button variant="secondary" onClick={this.editHandler}>
              Cancel
            </Button>
          </Form>
        ) : (
          <ListGroup key={this.props.value.Measure_ID} className="edit-post">
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
                {this.props.value.Measure_Name}
              </ListGroup.Item>
            </Link>
            <div
              style={{
                display: "inline",
                alignSelf: "center",
                padding: "0px 5px",
                cursor: "pointer"
              }}
              onClick={this.editHandler}
            >
              <FontAwesomeIcon icon="edit" className="edit" />
            </div>
          </ListGroup>
        )}
      </>
    );
  }
}

export default EditableMeasureList;
