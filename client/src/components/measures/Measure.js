import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import {
//   getSingleRubric,
//   setDataValue,
//   setMeasureValue
// } from "../../actions/rubricsActions";
import Spinner from "../../common/Spinner";

class Measure extends Component {
  render() {
    return <div>Measure displayed here</div>;
  }
}

export default connect(
  null,
  {}
)(Measure);
