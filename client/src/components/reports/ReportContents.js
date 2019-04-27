import React, { Component } from "react";
import { Switch, Route } from "react-router";
import MainReport from "./MainReport";
import MeasureReport from "./MeasureReport";
import OutcomeReport from "./OutcomeReport";
import TestMeasureReport from "./TestMeasureReport";
import CycleReport from "./CycleReport";
// import NewCycles from "../cycles/NewCycles";

class ReportContents extends Component {
  render() {
    return (
      <Switch className="report">
        <Route exact path="/dashboard/reports" component={MainReport} />
        <Route
          exact
          path="/dashboard/reports/cycle/:id(\d+)"
          component={CycleReport}
        />
        <Route
          exact
          path="/dashboard/reports/outcome/:id(\d+)"
          component={OutcomeReport}
        />
        <Route
          exact
          path="/dashboard/reports/rubricMeasure/:id(\d+)"
          component={MeasureReport}
        />
        <Route
          exact
          path="/dashboard/reports/testMeasure/:id(\d+)"
          component={TestMeasureReport}
        />
        {/* <Route path="/dashboard/cycles/:id(\d+)" component={ShowCycle} /> */}
      </Switch>
    );
  }
}
export default ReportContents;
