import React, { Component } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  ListGroup,
  FormControl,
  ButtonGroup
} from "react-bootstrap";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPrograms, createProgram } from "../../actions/programActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateProgram from "./CreateProgram";
import Spinner from "../../common/Spinner";
import EditableProgramList from "./EditableProgramList";
import isEmpty from "../../validation/isEmpty";

class AdminTools extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getPrograms();
  }
  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let { programs, loading } = this.props.programs;
    let programsList;
    if (loading) {
      programsList = <Spinner />;
    } else if (isEmpty(programs)) {
      programsList = (
        <ListGroup.Item>There are no programs added yet!</ListGroup.Item>
      );
    } else {
      programsList = programs.map(program => (
        <EditableProgramList {...program} />
      ));
    }
    return (
      <>
        <Card className="text-center">
          <Card.Header>List of Programs</Card.Header>
          <Card.Body style={{ padding: "0px" }}>
            <ListGroup variant="flush">{programsList}</ListGroup>
          </Card.Body>
          <Card.Footer
            onClick={() => this.setState({ modalShow: true })}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;&nbsp;&nbsp;Create a new program
          </Card.Footer>
        </Card>

        <CreateProgram
          show={this.state.modalShow}
          onHide={modalClose}
          createProgram={this.props.createProgram}
        />
      </>
    );
  }
}

AdminTools.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  programs: PropTypes.object.isRequired,
  getPrograms: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  programs: state.programs
});

export default connect(
  mapStateToProps,
  { getPrograms, createProgram }
)(AdminTools);
