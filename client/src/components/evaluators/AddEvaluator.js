import React, { Component } from "react";
import classnames from "classnames";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import isEmpty from "../../validation/isEmpty";

class AddEvaluator extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", errors: {} };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  submitHander = event => {
    if (!isEmpty(this.state.email)) {
      event.preventDefault();
      this.props.addEvaluator(this.state.email);
      this.setState({
        errors: {
          ...this.state.errors,
          email: ""
        },
        email: ""
      });
      this.hideModal();
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          email: "Email should not be empty"
        }
      });
    }
  };

  hideModal = () => {
    this.props.onHide();
    this.setState({
      errors: {
        ...this.state.errors,
        email: ""
      }
    });
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.hideModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Form className="createCycle" onSubmit={this.submitHander}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Evaluator
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group as={Row} controlId="formHorizontalRubric">
              <Form.Label column sm={4}>
                Email of the Evaluator:
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="email"
                  type="email"
                  required
                  placeholder="Eg. someone@someemail.com"
                  value={this.state.email}
                  onChange={this.onChange}
                  className={classnames("", {
                    "is-invalid": this.state.errors.email
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors.email}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.submitHander}>Send Invite</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default AddEvaluator;
