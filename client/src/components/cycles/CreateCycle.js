import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createCycle, migrateCycle } from "../../actions/cycleActions";
import classnames from "classnames";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import isEmpty from "../../validation/isEmpty";

class CreateCycle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      errors: {},
      option: "scratch",
      Migrate_Cycle_ID: "default"
    };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  submitHander = event => {
    event.preventDefault();

    let errors;
    if (isEmpty(this.state.name)) {
      errors = { Cycle_Name: "Cycle name cannot be empty" };
    } else {
      errors = { Cycle_Name: "" };
    }

    if (
      this.state.option === "migrate" &&
      this.state.Migrate_Cycle_ID === "default"
    ) {
      errors = {
        ...errors,
        Migrate_Cycle_ID: "Please select a cycle to migrate from"
      };
    } else {
      errors = {
        ...errors,
        Migrate_Cycle_ID: ""
      };
    }

    this.setState({
      errors: errors
    });

    if (errors.Cycle_Name === "" && errors.Migrate_Cycle_ID === "") {
      if (this.state.option === "migrate") {
        this.props.migrateCycle(this.state.name, this.state.Migrate_Cycle_ID);
      } else if (this.state.option === "scratch") {
        this.props.createCycle({ Cycle_Name: this.state.name });
        this.setState({
          errors: {}
        });
      }
      this.props.onHide();
    }
  };
  handleOptionChange = e => {
    this.setState({
      option: e.target.value
    });
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
                    "is-invalid": this.state.errors.Cycle_Name
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors.Cycle_Name}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="cycleOptions">
              <Form.Label column sm={4}>
                Cycle Options:
              </Form.Label>
              <Col sm={8}>
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    id="customRadio1"
                    name="option"
                    className="custom-control-input"
                    value="scratch"
                    checked={this.state.option === "scratch"}
                    onChange={this.handleOptionChange}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customRadio1"
                  >
                    Start from scratch
                  </label>
                </div>
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    id="customRadio2"
                    name="option"
                    className="custom-control-input"
                    value="migrate"
                    checked={this.state.option === "migrate"}
                    onChange={this.handleOptionChange}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customRadio2"
                  >
                    Migrate from a cycle
                  </label>
                </div>
              </Col>
            </Form.Group>
            {this.state.option === "migrate" ? (
              <Form.Group as={Row} controlId="formHorizontalRows">
                <Form.Label column sm={4}>
                  Choose a cycle:
                </Form.Label>
                <Col sm={8}>
                  <Form.Control
                    as="select"
                    name="Migrate_Cycle_ID"
                    value={this.state.Rows_Num}
                    onChange={this.onChange.bind(this)}
                    className={classnames("", {
                      "is-invalid": this.state.errors.Migrate_Cycle_ID
                    })}
                  >
                    {!isEmpty(this.props.cycles.everyCycles) ? (
                      <>
                        <option value="default">Select a cycle</option>
                        {this.props.cycles.everyCycles.map(cycle => (
                          <option value={cycle.Cycle_ID}>
                            {cycle.Cycle_Name}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option disabled>No cycles available</option>
                    )}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.Migrate_Cycle_ID}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            ) : null}
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

export default connect(
  mapStateToProps,
  { createCycle, migrateCycle }
)(CreateCycle);
