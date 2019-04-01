import React, { Component } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";

class EditableStudentList extends Component {
  constructor(props) {
    super(props);
    let { Student_Name, Student_ID } = this.props;
    this.state = {
      Student_Name: Student_Name,
      Student_ID: Student_ID,
      edit: false
    };
  }

  editStudent = e => {
    this.setState({
      edit: !this.state.edit
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
  render() {
    let { Student_Name, Student_ID, edit } = this.state;
    let student;
    if (!edit) {
      student = (
        <li key={Student_Name} onClick={this.editStudent}>
          {Student_Name} : {Student_ID}
        </li>
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
            />
            <InputGroup.Append>
              <Button variant="primary">Update Student</Button>
              <Button variant="primary" onClick={this.deleteStudent}>
                Delete Student
              </Button>
              <Button variant="outline-secondary" onClick={this.editStudent}>
                Cancel
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </li>
      );
    }
    return <>{student}</>;
  }
}

export default EditableStudentList;
