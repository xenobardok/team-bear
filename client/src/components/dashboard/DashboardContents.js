import React, { Component } from "react";
import { Switch, Route } from "react-router";
import Cycles from "../cycles/Cycles";
import ShowCycle from "../cycles/ShowCycle";
import Measure from "../measures/Measure";
import MainDashboard from "../dashboard/MainDashboard";
// import NewCycles from "../cycles/NewCycles";

class DashboardContents extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/dashboard" component={MainDashboard} />
        <Route exact path="/dashboard/cycles" component={Cycles} />
        <Route
          exact
          path="/dashboard/cycles/:id(\d+)/outcome/:outcomeID(\d+)/:measureID(\d+)"
          component={Measure}
        />
        <Route path="/dashboard/cycles/:id(\d+)" component={ShowCycle} />
      </Switch>
    );
  }
}
export default DashboardContents;
