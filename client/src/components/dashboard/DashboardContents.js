import React, { Component } from "react";
// import Spinner from "../../common/Spinner";
import { Route } from "react-router-dom";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { getCycles } from "../../actions/cycleActions";
// import { ListGroup, Card, Button } from "react-bootstrap";
// import { emoji } from "node-emoji";
import Cycles from "../cycles/Cycles";
import NewCycles from "../cycles/NewCycles";

class DashboardContents extends Component {
  render() {
    return <Route exact path="/dashboard" component={NewCycles} />;
  }
}
export default DashboardContents;
