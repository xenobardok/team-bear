import React, { Component } from "react";
import {
  InputGroup,
  FormControl,
  Button,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { toastr } from "react-redux-toastr";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheckCircle,
  faTrash,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
library.add(faEdit, faCheckCircle, faTrash, faWindowClose);

class EditableStudentList extends Component {
  constructor(props) {
    super(props);
    let { Student_Name, Student_ID } = this.props;
    this.state = {
      Student_Name: Student_Name,
      Student_ID: Student_ID,
      edit: false,
      showEdit: false
    };
  }

  editStudent = e => {
    this.setState({
      edit: !this.state.edit
    });
  };

  changeName = () => {
    if (this.state.Student_Name) {
      this.props.changeName(
        this.props.id,
        this.props.outcomeID,
        this.props.Measure_ID,
        this.state.Student_ID,
        this.state.Student_Name
      );
      this.setState({
        edit: false
      });
    } else {
      toastr.warning("Student Name cannot be empty");
    }
  };
  cancelStudent = e => {
    this.setState({
      edit: !this.state.edit,
      Student_Name: this.props.Student_Name,
      Student_ID: this.props.Student_ID
    });
  };
  deleteStudent = e => {
    this.props.removeStudentButton(this.state.Student_ID);
  };

  onChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onMouseEnterHandler = e => {
    this.setState({
      showEdit: true
    });
  };

  onMouseExitHandler = e => {
    this.setState({
      showEdit: false
    });
  };
  render() {
    let { Student_Name, Student_ID, edit } = this.state;
    let student;
    if (!edit) {
      student = (
        <>
          {this.props.Is_Submitted === "true" ? (
            <li key={Student_Name}>
              {Student_Name} : {Student_ID}
            </li>
          ) : (
            <div
              onMouseEnter={this.onMouseEnterHandler}
              onMouseLeave={this.onMouseExitHandler}
            >
              {this.state.showEdit ? (
                <OverlayTrigger
                  key="top"
                  placement="right"
                  overlay={
                    <Tooltip id="edit-student">
                      Edit {this.state.Student_Name}
                    </Tooltip>
                  }
                >
                  <FontAwesomeIcon
                    icon="edit"
                    className="edit"
                    onClick={this.editStudent}
                  />
                </OverlayTrigger>
              ) : null}
              {/* <FontAwesomeIcon icon="edit" className="edit" /> */}

              <li key={Student_Name}>
                {Student_Name} : {Student_ID}
              </li>
            </div>
          )}
        </>
      );
    } else {
      student = (
        <li>
          <InputGroup className="mb-3">
            <FormControl
              name="Student_Name"
              placeholder="Student name"
              aria-label="Student name"
              aria-describedby="basic-addon2"
              value={Student_Name}
              onChange={this.onChangeHandler}
            />
            <FormControl
              name="Student_ID"
              placeholder="Student ID"
              aria-label="ID"
              aria-describedby="basic-addon2"
              value={Student_ID}
              onChange={this.onChangeHandler}
              disabled
            />
            <InputGroup.Append>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Save Changes</Tooltip>}
              >
                <Button variant="primary" onClick={this.changeName}>
                  <FontAwesomeIcon icon="check-circle" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Delete Student</Tooltip>}
              >
                <Button variant="primary" onClick={this.deleteStudent}>
                  <FontAwesomeIcon icon="trash" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Cancel</Tooltip>}
              >
                <Button
                  variant="outline-secondary"
                  onClick={this.cancelStudent}
                >
                  <FontAwesomeIcon icon="window-close" />
                </Button>
              </OverlayTrigger>
            </InputGroup.Append>
          </InputGroup>
        </li>
      );
    }
    return <>{student}</>;
  }
}

export default EditableStudentList;
