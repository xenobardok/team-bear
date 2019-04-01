import React, { Component } from "react";
import { Jumbotron, Container } from "react-bootstrap";

export default class MainDashboard extends Component {
  render() {
    return (
      <Jumbotron fluid>
        <Container>
          <h1>Hello!</h1>
          <p>This is your dashboard</p>
        </Container>
      </Jumbotron>
    );
  }
}
