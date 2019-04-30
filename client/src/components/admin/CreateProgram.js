import React, { useState } from "react";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import isEmpty from "../../validation/isEmpty";

function CreateProgram(props) {
  const [DeptID, changeDeptID] = useState("");
  const [DeptName, changeDeptName] = useState("");
  const [errors, setErrors] = useState("");

  const submitHander = e => {
    e.preventDefault();

    let errors;
    if (isEmpty(DeptID)) {
      errors = { DeptID: "Department ID cannot be empty" };
    } else {
      errors = { DeptID: "" };
    }

    if (isEmpty(DeptName)) {
      errors = { ...errors, DeptName: "Department Name cannot be empty" };
    } else {
      errors = { ...errors, DeptName: "" };
    }

    setErrors(errors);

    if (errors.DeptID === "" && errors.DeptName === "") {
      props.createProgram(DeptID, DeptName);
      props.onHide();
    }
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
              Department ID:
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
              Department Name:
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
