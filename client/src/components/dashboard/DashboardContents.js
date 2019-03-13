import React, { Component } from "react";
import Spinner from "../../common/Spinner";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCycles } from "../../actions/cycleActions";
import { ListGroup, Card, Button } from "react-bootstrap";
import { emoji } from "node-emoji";

class DashboardContents extends Component {
  componentDidMount() {
    this.props.getCycles();
  }
  render() {
    return <Spinner />;
  }
}
DashboardContents.propTypes = {
  getCycles: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  cycles: state.cycles
});

export default connect(
  mapStateToProps,
  { getCycles }
)(DashboardContents);
