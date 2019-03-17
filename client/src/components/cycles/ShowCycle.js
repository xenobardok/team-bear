import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSingleCycle } from "../../actions/cycleActions";
import { Card, ListGroup, Table, FormControl } from "react-bootstrap";
import Spinner from "../../common/Spinner";

class ShowCycle extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getSingleCycle(this.props.match.params.id);
    }
  }
  render() {
    const { cycle, loading, allCycles } = this.props.cycles;
    let outcomes = "";
    let cycleName = "";
    if (loading) {
      outcomes = <Spinner />;
    } else if (cycle === null) {
      outcomes = <h1>CYCLE NOT FOUND</h1>;
    } else {
      cycleName = cycle.Cycle_Name;
      if (Object.keys(cycle).length > 0) {
        outcomes = cycle.data.map(value => (
          <ListGroup.Item action key={value.Outcome_ID}>
            {value.Outcome_Name}
          </ListGroup.Item>
        ));
      }
    }
    return (
      <div>
        <h2>{cycleName}</h2>
        <Card className="text-center cycle">
          <Card.Header>List of Outcomes</Card.Header>

          <ListGroup variant="flush">{outcomes}</ListGroup>

          <Card.Footer className="text-muted">2 days ago</Card.Footer>
        </Card>
      </div>
    );
  }
}

ShowCycle.propTypes = {
  getSingleCycle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  cycles: state.cycles
});

export default connect(
  mapStateToProps,
  { getSingleCycle }
)(ShowCycle);
