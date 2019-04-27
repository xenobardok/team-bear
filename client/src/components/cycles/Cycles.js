import React, { Component } from "react";
import Spinner from "../../common/Spinner";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getCycles,
  deleteCycle,
  updateCycleName,
  submitCycle
} from "../../actions/cycleActions";
import classnames from "classnames";
import { ListGroup, Card, Button } from "react-bootstrap";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import CreateCycle from "./CreateCycle";
import isEmpty from "../../validation/isEmpty";
import EditableCycleList from "./EditableCycleList";
library.add(faPlus, faEdit);

class Cycles extends Component {
  constructor() {
    super();

    this.state = { modalShow: false };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.cycles.cycle) {
      // console.log(nextProps.cycles);
      // console.log(nextProps.errors);

      if (isEmpty(nextProps.errors)) {
        this.setState({
          modalShow: false
        });
      }
    }

    if (nextProps.errors === "unauthorized") {
      this.props.history.push("/login");
    }
  }

  componentDidMount() {
    this.props.getCycles();
  }
  render() {
    let modalClose = () => this.setState({ modalShow: false });

    let { allCycles, loading } = this.props.cycles;

    let cyclesList = "";
    let newCycle;
    if (this.props.auth.user.type === "Admin") {
      if (allCycles === null || loading) {
        cyclesList = <Spinner />;
      } else {
        //   Check if logged in user has cycles to view
        if (Object.keys(allCycles).length > 0) {
          cyclesList = allCycles.map(value => (
            <EditableCycleList
              key={value.Cycle_ID}
              value={value}
              deleteCycle={this.props.deleteCycle}
              updateCycleName={this.props.updateCycleName}
              submitCycle={this.props.submitCycle}
            />
          ));
        } else {
          cyclesList = (
            <div>
              <br />
              <h5>There are no active cycles to view for you!</h5>
              <Link to="/dashboard">
                <Button variant="primary">Return to Dashboard</Button>
              </Link>
              <br />
              <br />
            </div>
          );
        }
      }
    }
    return (
      <>
        <Card className="text-center">
          <Card.Header>List of Available Cycles</Card.Header>
          <Card.Body style={{ padding: "0px" }}>
            <ListGroup variant="flush">
              {cyclesList}
              {newCycle}
            </ListGroup>
          </Card.Body>
          <Card.Footer
            onClick={() => this.setState({ modalShow: true })}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;&nbsp;&nbsp;Create a new cycle
          </Card.Footer>
        </Card>

        <CreateCycle show={this.state.modalShow} onHide={modalClose} />
      </>
    );
  }
}
Cycles.propTypes = {
  getCycles: PropTypes.func.isRequired,
  updateCycleName: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  cycles: state.cycles
});

export default connect(
  mapStateToProps,
  { getCycles, deleteCycle, updateCycleName, submitCycle }
)(Cycles);
