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

class Editable extends Component {
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
              defaultValue={this.props.value.Cycle_Name}
            />
            <Button variant="primary">Update</Button>
            <Button variant="secondary" onClick={this.editHandler}>
              Cancel
            </Button>
          </Form>
        ) : (
          <ListGroup key={this.props.value.Cycle_ID} className="edit-post">
            <Link
              to={"/dashboard/cycles/" + this.props.value.Cycle_ID}
              style={{ flexGrow: "1" }}
            >
              <ListGroup.Item action key={this.props.value.Cycle_ID}>
                {this.props.value.Cycle_Name}
              </ListGroup.Item>
            </Link>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit {this.props.value.Cycle_Name}</Tooltip>}
            >
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
            </OverlayTrigger>
          </ListGroup>
        )}
      </>
    );
  }
}

export default Editable;
