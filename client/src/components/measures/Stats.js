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
    } else if (Is_Success === "false") {
      label = (
        <Badge variant="danger">
          <span style={{ fontWeight: "500" }}>Failing</span>
        </Badge>
      );
    } else if (Is_Success === "pending") {
      label = (
        <Badge variant="warning">
          <span style={{ fontWeight: "500" }}>Pending</span>
        </Badge>
      );
    }

    progressInstance = (
      <ProgressBar
        variant="danger"
        now={now}
        label={`${now}%`}
        style={{ flexGrow: "1" }}
      />
    );

    return (
      <section>
        <h5>Status: {label}</h5>
        <div className="px-2">
          <div style={{ display: "flex", alignItems: "center" }}>
            <p style={{ margin: "5px 10px 5px 0px" }}>Progress:</p>{" "}
            {progressInstance}
          </div>
          <p>
            {Total_Students} student(s) were evaluated and only{" "}
            {Student_Achieved_Target_Count} student(s) achieved target score.
          </p>
        </div>
      </section>
    );
  }
}

export default Stats;
