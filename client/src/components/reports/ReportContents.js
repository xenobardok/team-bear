import React, { Component } from "react";
import { Switch, Route } from "react-router";
import Cycles from "../cycles/Cycles";
import ShowCycle from "../cycles/ShowCycle";
import Measure from "../measures/Measure";
import MainDashboard from "../dashboard/MainDashboard";
import MainReport from "./MainReport";
import MeasureReport from "./MeasureReport";
// import NewCycles from "../cycles/NewCycles";

class ReportContents extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/dashboard/reports" component={MainReport} />
        <Route
          exact
          path="/dashboard/reports/measure/:id(\d+)"
          component={MeasureReport}
        />
        {/* <Route path="/dashboard/cycles/:id(\d+)" component={ShowCycle} /> */}
      </Switch>
    );
  }
}
export default ReportContents;