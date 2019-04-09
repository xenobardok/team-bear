import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class FourOFour extends Component {
  render() {
    return (
      <div>
        <h1 className="text-center">404</h1>
        <p className="text-center">
          <Link to="/dashboard" className="newa">
            Return to homepage
          </Link>
        </p>
      </div>
    );
  }
}
