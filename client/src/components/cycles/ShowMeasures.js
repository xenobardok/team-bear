import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSingleCycle } from "../../actions/cycleActions";
import { Card, ListGroup, Table, FormControl } from "react-bootstrap";
import Spinner from "../../common/Spinner";

class ShowMeasures extends Component {
  render() {
    let measures = "";
    if (this.props.data) {
      measures = this.props.data.map(value => (
        <ListGroup.Item key={value.Measure_ID}>
          {value.Measure_Name}
        </ListGroup.Item>
      ));
    }
    return (
      <div>
        <h2>Outcome name</h2>
        <Card className="text-center cycle">
          <Card.Header>List of Measures</Card.Header>

          <ListGroup variant="flush">{measures}</ListGroup>

          <Card.Footer className="text-muted">2 days ago</Card.Footer>
        </Card>
      </div>
    );
  }
}

ShowMeasures.propTypes = {
  getSingleCycle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  measure: state.measure
});

export default connect(
  mapStateToProps,
  { getSingleCycle }
)(ShowMeasures);
