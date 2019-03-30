import React, { Component } from "react";
import { ProgressBar, Badge } from "react-bootstrap";
import isEmpty from "../../validation/isEmpty";
import classnames from "classnames";

class Stats extends Component {
  render() {
    let {
      Achieved_Threshold,
      Is_Success,
      Total_Students,
      Student_Achieved_Target_Count
    } = this.props;
    let progressInstance;
    const now = Math.floor(Achieved_Threshold * 100) / 100;
    let label;
    if (Is_Success === "true") {
      label = (
        <Badge variant="success">
          <span style={{ fontWeight: "400" }}>Passing</span>
        </Badge>
      );
      progressInstance = (
        <ProgressBar
          variant="success"
          now={now}
          label={`${now}%`}
          style={{ flexGrow: "1" }}
        />
      );
    } else {
      label = (
        <Badge variant="warning">
          <span style={{ fontWeight: "500" }}>Failing</span>
        </Badge>
      );

      progressInstance = (
        <ProgressBar
          variant="danger"
          now={now}
          label={`${now}%`}
          style={{ flexGrow: "1" }}
        />
      );
    }
    return (
      <section>
        <h5>Stats:</h5>
        <ul style={{ listStyleType: "none" }}>
          <li>Status: {label}</li>
          <li style={{ display: "flex", alignItems: "center" }}>
            <p style={{ margin: "5px 10px 5px 0px" }}>Progress:</p>{" "}
            {progressInstance}
          </li>
          <li>
            {Total_Students} student(s) were evaluated and only{" "}
            {Student_Achieved_Target_Count} student(s) achieved target score.
          </li>
        </ul>
      </section>
    );
  }
}

export default Stats;
