import React, { Component } from "react";
import Spinner from "../../common/Spinner";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCycles } from "../../actions/cycleActions";

import {
  ListGroup,
  Card,
  Button,
  Modal,
  Form,
  Col,
  Row
} from "react-bootstrap";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus);

class CreateCycle extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create a new Cycle
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} controlId="formHorizontalRubric">
            <Form.Label column sm={4}>
              Name of the Cycle:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                name="Cycle_Name"
                type="text"
                placeholder="Eg. Assessment Cycle 2018 - 2019"
                // value={this.state.Rubric_Name}
                // onChange={this.onChange.bind(this)}
                // className={classnames("", { "is-invalid": errors.Rubric_Name })}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.Rubric_Name}
              </Form.Control.Feedback> */}
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

class Cycles extends Component {
  constructor(...args) {
    super(...args);

    this.state = { modalShow: false };
  }
  componentDidMount() {
    this.props.getCycles();
  }
  render() {
    let modalClose = () => this.setState({ modalShow: false });

    let { allCycles, loading } = this.props.cycles;

    let cyclesList = "";
    let createCycle;
    if (this.props.auth.user.type === "Admin") {
      if (allCycles === null || loading) {
        cyclesList = <Spinner />;
      } else {
        //   Check if logged in user has cycles to view
        if (Object.keys(allCycles).length > 0) {
          cyclesList = allCycles.map(value => (
            <Link
              key={value.Cycle_ID}
              to={"/dashboard/cycles/" + value.Cycle_ID}
            >
              <ListGroup.Item action key={value.Cycle_ID}>
                {value.Cycle_Name}
              </ListGroup.Item>
            </Link>
          ));
        } else {
          cyclesList = (
            <div>
              <br />
              <h4>There is no cycles to view for you!</h4>
              <Link to="/dashboard">
                <Button variant="info">Return to Dashboard</Button>
              </Link>
              <br />
              <br />
            </div>
          );
        }

        createCycle = (
          <ListGroup.Item
            action
            onClick={() => this.setState({ modalShow: true })}
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;&nbsp;&nbsp;Create a new cycle
          </ListGroup.Item>
        );
      }
    }

    return (
      <>
        <Card className="text-center">
          <Card.Header>List of Available Cycles</Card.Header>
          <Card.Body style={{ padding: "0px" }}>
            <ListGroup variant="flush">
              {cyclesList}
              {createCycle}
            </ListGroup>
          </Card.Body>
        </Card>

        <CreateCycle show={this.state.modalShow} onHide={modalClose} />
      </>
    );
  }
}
Cycles.propTypes = {
  getCycles: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  cycles: state.cycles
});

export default connect(
  mapStateToProps,
  { getCycles }
)(Cycles);
