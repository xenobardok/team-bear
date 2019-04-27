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
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import ThreeDotDropdown from "./ThreeDotDropdown";
library.add(faPlus, faEdit);

class EditableRubricList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      Rubric_Name: this.props.Rubrics_Name
    };
  }

  editHandler = e => {
    let { isEditable } = this.state;
    this.setState({
      isEditable: !isEditable
    });
  };

  cancelButtonHandler = e => {
    this.setState({
      Rubric_Name: this.props.Rubrics_Name,
      isEditable: false
    });
  };
  deleteHandler = e => {
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
        this.props.deleteRubric(this.props.Rubric_ID);
        this.editHandler();
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  updateButtonHandler = e => {
    this.props.updateCycleName(
      this.props.value.Cycle_ID,
      this.state.Cycle_Name
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
              value={this.state.Rubric_Name}
              className="mt-1 ml-1 mr-1"
              onChange={e => this.setState({ Rubric_Name: e.target.value })}
            />

            <ButtonGroup size="sm" className="mt-1 mb-1">
              <Button variant="primary" onClick={this.updateButtonHandler}>
                Update
              </Button>
              <Button variant="secondary" onClick={this.cancelButtonHandler}>
                Cancel
              </Button>
              <Button variant="outline-danger" onClick={this.deleteHandler}>
                Delete
              </Button>
            </ButtonGroup>
          </Form>
        ) : (
          <ListGroup key={this.props.Rubric_ID} className="edit-post">
            <Link
              key={this.props.Rubric_ID}
              to={"/dashboard/rubrics/" + this.props.Rubric_ID}
              style={{ flexGrow: "1" }}
            >
              <ListGroup.Item action key={this.props.Rubric_ID}>
                {this.props.Rubrics_Name}
              </ListGroup.Item>
            </Link>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit {this.props.Rubric_Name}</Tooltip>}
            >
              <div
                style={{
                  display: "flex",
                  alignSelf: "center",
                  cursor: "pointer"
                }}
              >
                <ThreeDotDropdown
                  editHandler={this.editHandler}
                  type="Rubric"
                />
              </div>
            </OverlayTrigger>
          </ListGroup>
        )}
      </>
    );
  }
}

export default EditableRubricList;
