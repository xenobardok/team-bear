import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSingleCycle } from "../../actions/cycleActions";
import { Table, FormControl } from "react-bootstrap";
import Spinner from "../../common/Spinner";

class ShowCycle extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getSingleCycle(this.props.match.params.id);
    }
  }
  render() {
    return (
      <div>
        <h1>Show Cycle working</h1>
      </div>
    );
  }
}

ShowCycle.propTypes = {
  getSingleCycle: PropTypes.func.isRequired
};

export default connect(
  null,
  { getSingleCycle }
)(ShowCycle);
