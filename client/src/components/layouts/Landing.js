import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavBar from "./NavBar";

class Landing extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={NavBar} />

        <div className="main">
          <div className="mainContext">
            <h1>Welcome to ULM Evaluations</h1>
            <br />
            <p>Get Evaluations done at the right place!</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
