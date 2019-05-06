import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Tab, ListGroup } from "react-bootstrap";
import classnames from "classnames";
import isEmpty from "../../validation/isEmpty";
export default function EditProfile(props) {
  const [firstname, changeFirstname] = useState(props.firstname);
  const [lastname, changeLastname] = useState(props.lastname);
  const [oldPassword, changeOldPassword] = useState("");
  const [email, changeEmail] = useState("");
  const [newPassword, changenewPassword] = useState("");
  const [newPasswordAgain, changeNewPasswordAgain] = useState("");
  const [errors, changeErrors] = useState({ firstname: "", lastname: "" });

  let changeUserPassword = () => {
    props.changeUserPassword(email, newPassword);
    props.onHide();
  };
  let nameSubmitHandler = () => {
    let tempErrors;
    if (isEmpty(firstname)) {
      tempErrors = {
        firstname: "First name cannot be empty"
      };
    } else {
      tempErrors = {
        firstname: ""
      };
    }
    if (isEmpty(lastname)) {
      tempErrors = {
        ...tempErrors,
        lastname: "Last name cannot be empty"
      };
    } else {
      tempErrors = {
        ...tempErrors,
        lastname: ""
      };
    }
    // console.log(tempErrors);
    changeErrors({
      ...errors,
      ...tempErrors
    });
    if (tempErrors.firstname === "" && tempErrors.lastname === "") {
      //submit here
      props.changeName(firstname, lastname);
      props.onHide();
    }
  };

  let passwordSubmitHandler = () => {
    let tempErrors;

    if (oldPassword) {
      if (oldPassword.length < 6 || oldPassword.length > 20) {
        tempErrors = {
          oldPassword: "Password must be between 6-20 characters long"
        };
      } else {
        tempErrors = { oldPassword: "" };
      }
    } else {
      tempErrors = { oldPassword: "Old password is required" };
    }

    if (newPassword) {
      if (newPassword.length < 6 || newPassword.length > 20) {
        tempErrors = {
          ...tempErrors,
          newPassword: "Password must be between 6-20 characters long"
        };
      } else {
        tempErrors = { ...tempErrors, newPassword: "" };
      }
    } else {
      tempErrors = { ...tempErrors, newPassword: "New password is required" };
    }

    if (newPasswordAgain) {
      if (newPasswordAgain !== newPassword) {
        tempErrors = {
          ...tempErrors,
          newPasswordAgain: "New password does not match"
        };
      } else {
        tempErrors = { ...tempErrors, newPasswordAgain: "" };
      }
    } else {
      tempErrors = {
        ...tempErrors,
        newPasswordAgain: "New password is required again"
      };
    }

    changeErrors({
      ...errors,
      ...tempErrors
    });

    if (
      tempErrors.oldPassword === "" &&
      tempErrors.newPassword === "" &&
      tempErrors.newPasswordAgain === ""
    ) {
      //submit here
      props.changePassword(oldPassword, newPassword);
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
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Profile
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#name">
          <Row>
            <Col sm={4}>
              <ListGroup>
                <ListGroup.Item action href="#name">
                  Edit Name
                </ListGroup.Item>
                <ListGroup.Item action href="#password">
                  Edit Password
                </ListGroup.Item>
                {props.isSuperUser === "true" ? (
                  <ListGroup.Item action href="#userpassword">
                    Edit User Password
                  </ListGroup.Item>
                ) : null}
              </ListGroup>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                <Tab.Pane eventKey="#name">
                  <Form>
                    <Form.Group>
                      <Form.Row>
                        <Col>
                          <Form.Label>First name</Form.Label>
                          <Form.Control
                            placeholder="First name"
                            value={firstname}
                            name="firstname"
                            onChange={e => changeFirstname(e.target.value)}
                            className={classnames("", {
                              "is-invalid": errors.firstname
                            })}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstname}
                          </Form.Control.Feedback>
                        </Col>
                        <Col>
                          <Form.Label>Last name</Form.Label>
                          <Form.Control
                            placeholder="Last name"
                            value={lastname}
                            name="lastname"
                            onChange={e => changeLastname(e.target.value)}
                            className={classnames("", {
                              "is-invalid": errors.lastname
                            })}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastname}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Row>
                    </Form.Group>
                    <Form.Group className="text-center">
                      <Button variant="primary" onClick={nameSubmitHandler}>
                        Change Name
                      </Button>
                    </Form.Group>
                  </Form>
                </Tab.Pane>
                <Tab.Pane eventKey="#password">
                  <Form.Group>
                    <Form.Label>Type old password</Form.Label>
                    <Form.Control
                      placeholder="Old Password"
                      type="password"
                      value={oldPassword}
                      name="oldPassword"
                      onChange={e => changeOldPassword(e.target.value)}
                      className={classnames("", {
                        "is-invalid": errors.oldPassword
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.oldPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Type new password</Form.Label>
                    <Form.Control
                      placeholder="New Password"
                      type="password"
                      value={newPassword}
                      name="newPassword"
                      onChange={e => changenewPassword(e.target.value)}
                      className={classnames("", {
                        "is-invalid": errors.newPassword
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.newPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Type new password again</Form.Label>
                    <Form.Control
                      placeholder="New Password Again"
                      type="password"
                      value={newPasswordAgain}
                      name="newPasswordAgain"
                      onChange={e => changeNewPasswordAgain(e.target.value)}
                      className={classnames("", {
                        "is-invalid": errors.newPasswordAgain
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.newPasswordAgain}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="text-center">
                    <Button variant="primary" onClick={passwordSubmitHandler}>
                      Change Password
                    </Button>
                  </Form.Group>
                </Tab.Pane>

                {props.isSuperUser === "true" ? (
                  <Tab.Pane eventKey="#userpassword">
                    <Form.Group>
                      <Form.Label>Type User Email</Form.Label>
                      <Form.Control
                        placeholder="User Email"
                        type="email"
                        value={email}
                        name="email"
                        onChange={e => changeEmail(e.target.value)}
                        className={classnames("", {
                          "is-invalid": errors.email
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Type new password</Form.Label>
                      <Form.Control
                        placeholder="New Password"
                        type="password"
                        value={newPassword}
                        name="newPassword"
                        onChange={e => changenewPassword(e.target.value)}
                        className={classnames("", {
                          "is-invalid": errors.newPassword
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.newPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="text-center">
                      <Button variant="primary" onClick={changeUserPassword}>
                        Change Password
                      </Button>
                    </Form.Group>
                  </Tab.Pane>
                ) : null}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}
