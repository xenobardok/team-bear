import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Button,
  ButtonGroup,
  Table,
  Form,
  Col,
  Row
} from "react-bootstrap";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import ThreeDotDropdown from "./ThreeDotDropdown";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toastr } from "react-redux-toastr";
import {
  getProgram,
  addProgramAdmin,
  removeProgramAdmin,
  updateProgramID,
  updateProgramName,
  deleteProgram
} from "../../actions/programActions";
import Coordinator from "./Coordinator";
import classnames from "classnames";
import Department from "./Department";
library.add(faTrash);

class Program extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newCoordinator: false,
      newCoordinatorEmail: "",
      editDepartmentID: false,
      editDepartmentName: false
    };
  }
  componentDidMount() {
    let { programID } = this.props.match.params;
    this.props.getProgram(programID);
  }

  componentDidUpdate = prevProps => {
    if (this.props.programs.program !== prevProps.programs.program) {
      if (this.props.programs.program.deleted) {
        this.props.history.push("/dashboard/programs");
      }
    }
  };

  toggleNewCoordinator = e => {
    this.setState({
      newCoordinator: !this.state.newCoordinator
    });
  };

  addNewCoordinator = e => {
    let { programID } = this.props.match.params;
    if (this.state.newCoordinatorEmail) {
      this.props.addProgramAdmin(programID, this.state.newCoordinatorEmail);
      this.setState({
        newCoordinatorEmail: "",
        newCoordinator: false
      });
    }
  };

  toggleDepartmentIDEdit = () => {
    this.setState({
      editDepartmentID: !this.state.editDepartmentID
    });
  };

  toggleDepartmentNameEdit = () => {
    this.setState({
      editDepartmentName: !this.state.editDepartmentName
    });
  };

  render() {
    let { loading, program } = this.props.programs;
    let programOutput;

    if (loading || isEmpty(program)) {
      programOutput = <Spinner />;
    } else {
      programOutput = (
        <div>
          <ThreeDotDropdown
            toggleDepartmentIDEdit={this.toggleDepartmentIDEdit}
            toggleDepartmentNameEdit={this.toggleDepartmentNameEdit}
            deleteProgram={this.props.deleteProgram}
            Department_ID={program.Department_ID}
          />
          <Department
            {...program}
            editID={this.state.editDepartmentID}
            editName={this.state.editDepartmentName}
            toggleDepartmentIDEdit={this.toggleDepartmentIDEdit}
            toggleDepartmentNameEdit={this.toggleDepartmentNameEdit}
            updateProgramID={this.props.updateProgramID}
            updateProgramName={this.props.updateProgramName}
          />
          <br />
          <section>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th colSpan="4" className="text-center">
                    Program Coordinators:
                  </th>
                </tr>
                <tr className="text-center">
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Edit Options</th>
                </tr>
              </thead>
              <tbody>
                {program.admin.map((admin, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <Coordinator
                      {...admin}
                      Department_ID={program.Department_ID}
                      removeProgramAdmin={this.props.removeProgramAdmin}
                    />
                  </tr>
                ))}
                {this.state.newCoordinator ? (
                  <tr>
                    <td>{program.admin.length + 1}</td>
                    <td colSpan="2">
                      <Form.Group controlId="formBasicEmail" as={Row}>
                        <Col sm="3">
                          <Form.Label>Email address:</Form.Label>
                        </Col>
                        <Col sm="9">
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={this.state.newCoordinatorEmail}
                            onChange={e =>
                              this.setState({
                                newCoordinatorEmail: e.target.value
                              })
                            }
                            className={classnames("", {
                              "is-invalid": this.props.errors.email
                            })}
                          />
                          <Form.Control.Feedback type="invalid">
                            {this.props.errors.email}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>
                    </td>
                    <td className="text-center trash">
                      <FontAwesomeIcon icon="trash" />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </Table>
            <br />
            <div className="text-center">
              {!this.state.newCoordinator ? (
                <Button
                  style={{ marginLeft: "30px auto" }}
                  onClick={this.toggleNewCoordinator}
                >
                  Add a coordinator
                </Button>
              ) : (
                <Button variant="primary" onClick={this.addNewCoordinator}>
                  Save
                </Button>
              )}
              &nbsp;
              {this.state.newCoordinator ? (
                <Button variant="secondary" onClick={this.toggleNewCoordinator}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </section>
        </div>
      );
    }
    return <Container className="program">{programOutput}</Container>;
  }
}

Program.propTypes = {};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  programs: state.programs
});

export default connect(
  mapStateToProps,
  {
    getProgram,
    addProgramAdmin,
    removeProgramAdmin,
    updateProgramID,
    updateProgramName,
    deleteProgram
  }
)(Program);
