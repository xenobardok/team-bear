import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

class NavBar extends Component {
  render() {
    return (
      <Router>
        <div className="main">
          <div className="mainContext">
            <h1>Welcome to ULM Evaluations</h1>
            <br />
            <p>Get Evaluations done at the right place!</p>
          </div>
        </div>
      </Router>
    );
  }
}

export default NavBar;
