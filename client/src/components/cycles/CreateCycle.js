import React, { Component } from "react";
import Spinner from "../../common/Spinner";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createCycle } from "../../actions/cycleActions";
import classnames from "classnames";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";

class CreateCycle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", errors: {} };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  submitHander = event => {
    event.preventDefault();
    this.props.createCycle({ Cycle_Name: this.state.name });
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Form className="createCycle" onSubmit={this.submitHander}>
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
                  name="name"
                  type="text"
                  placeholder="Eg. Assessment Cycle 2018 - 2019"
                  value={this.state.name}
                  onChange={this.onChange.bind(this)}
                  className={classnames("", {
                    "is-invalid": this.props.errors.Cycle_Name
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {this.props.errors.Cycle_Name}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.submitHander}>Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

CreateCycle.propTypes = {
  auth: PropTypes.object.isRequired,
  createCycle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  cycles: state.cycles
});

export default withRouter(
  connect(
    mapStateToProps,
    { createCycle }
  )(CreateCycle)
);
