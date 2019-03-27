import React, { Component } from "react";
// import Spinner from "../../common/Spinner";
import { Switch, Route } from "react-router";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { getCycles } from "../../actions/cycleActions";
// import { ListGroup, Card, Button } from "react-bootstrap";
// import { emoji } from "node-emoji";
import Cycles from "../cycles/Cycles";
import ShowCycle from "../cycles/ShowCycle";
import Measure from "../measures/Measure";
import NewCycles from "../cycles/NewCycles";

class DashboardContents extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/dashboard" component={Cycles} />
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
