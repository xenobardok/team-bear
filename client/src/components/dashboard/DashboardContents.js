import React, { Component } from "react";
import { emoji } from "node-emoji";

class DashboardContents extends Component {
  render() {
    return (
      <div>
        <h1>Dashboard is going to be {emoji["100"]}</h1>
      </div>
      );
  }
}

export default DashboardContents;
