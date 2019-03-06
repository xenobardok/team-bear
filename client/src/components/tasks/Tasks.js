import React, { Component } from "react";
import { ListGroup, Row, Col } from "react-bootstrap";

class Tasks extends Component {
  render() {
    return (
      <div>
        <h1>Tasks</h1>
        <br />
        <Row>
          <Col>
            <h3>List of rubrics I have assigned others</h3>
            <br />
            <ListGroup>
              <ListGroup.Item action href="#link1">
                Rubric 1
              </ListGroup.Item>
              <ListGroup.Item action href="#link2">
                Rubric 2
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col>
            <h3>List of rubrics I have assigned others</h3>
            <br />
            <ListGroup>
              <ListGroup.Item action href="#link1">
                Link 1
              </ListGroup.Item>
              <ListGroup.Item action href="#link2">
                Link 2
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Tasks;
