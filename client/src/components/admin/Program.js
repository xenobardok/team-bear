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
  removeProgramAdmin
} from "../../actions/programActions";
import Coordinator from "./Coordinator";
import classnames from "classnames";
library.add(faTrash);

class Program extends Component {
  constructor(props) {
    super(props);
    this.state = { newCoordinator: false, newCoordinatorEmail: "" };
  }
  componentDidMount() {
    let { programID } = this.props.match.params;
    console.log(programID);
    this.props.getProgram(programID);
  }

  toggleNewCoordinator = e => {
    this.setState({
      newCoordinator: !this.state.newCoordinator
    });
  };

  addNewCoordinator = e => {
    let { programID } = this.props.match.params;
    if (this.state.newCoordinatorEmail) {
      this.props.addProgramAdmin(programID, this.state.newCoordinatorEmail);
    }
  };
  render() {
    let { loading, program } = this.props.programs;
    let programOutput;

    if (loading || isEmpty(program)) {
      programOutput = <Spinner />;
    } else {
      programOutput = (
        <div>
          <ThreeDotDropdown />
          <section>
            <h4>Department ID: {program.Dept_ID}</h4>
            <h4>Department Name: {program.Dept_Name}</h4>
          </section>
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
                      Dept_ID={program.Dept_ID}
                      removeProgramAdmin={this.props.removeProgramAdmin}
                    />
                  </tr>
                ))}
                {this.state.newCoordinator ? (
                  <tr>
                    <td>{program.admin.length + 1}</td>
                    <td colSpan="2">
                      <Form.Group controlId="formBasicEmail" as={Row}>
                        <Col column sm="3">
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
                              "is-invalid": this.props.errors.Dept_ID
                            })}
                          />
                          <Form.Control.Feedback type="invalid">
                            {this.props.errors.Dept_ID}
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
  { getProgram, addProgramAdmin, removeProgramAdmin }
)(Program);
