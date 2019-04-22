import React, { Component, useState } from "react";
import Spinner from "../../common/Spinner";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createCycle, migrateCycle } from "../../actions/cycleActions";
import classnames from "classnames";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import isEmpty from "../../validation/isEmpty";

function CreateProgram(props) {
  const [DeptID, changeDeptID] = useState("");
  const [DeptName, changeDeptName] = useState("");
  const submitHander = e => {
    e.preventDefault();
    console.log(DeptID, DeptName);
    props.createProgram(DeptID, DeptName);
  };
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <form className="createProgram" onSubmit={submitHander}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create a new Program
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} controlId="formHorizontalRubric">
            <Form.Label column sm={4}>
              Program Abbreviation:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                name="Dept_ID"
                type="text"
                placeholder="Eg. CSCI"
                value={DeptID}
                onChange={e => changeDeptID(e.target.value)}
                // className={classnames("", {
                //   "is-invalid": this.state.errors.Cycle_Name
                // })}
              />
              {/* <Form.Control.Feedback type="invalid">
                  {this.state.errors.Cycle_Name}
                </Form.Control.Feedback> */}
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalRubric">
            <Form.Label column sm={4}>
              Program Full Form:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                name="Dept_Name"
                type="text"
                placeholder="Eg. Computer Science"
                value={DeptName}
                onChange={e => changeDeptName(e.target.value)}

                // onChange={this.onChange.bind(this)}
                // className={classnames("", {
                //   "is-invalid": this.state.errors.Cycle_Name
                // })}
              />
              {/* <Form.Control.Feedback type="invalid">
                  {this.state.errors.Cycle_Name}
                </Form.Control.Feedback> */}
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitHander}>Create</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default CreateProgram;
