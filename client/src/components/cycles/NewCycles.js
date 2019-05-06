import React, { Component } from "react";
import Spinner from "../../common/Spinner";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCycles, getSingleCycle } from "../../actions/cycleActions";
import classnames from "classnames";
import { ListGroup, Card, Button } from "react-bootstrap";
import CreateCycle from "./CreateCycle";
import EditableCycleList from "./EditableCycleList";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus);

class Cycles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: ""
    };
  }
  componentDidMount = () => {
    if (this.props.errors === "unauthorized") {
      this.props.history.push("/login");
    }

    this.props.getCycles();
    this.props.getSingleCycle(this.props.cycles.activeCycle);
    // console.log(this.props.cycles);
  };

  onSelectChange = e => {
    this.props.getSingleCycle(e.target.value);
    // console.log(e.target.value);
    this.setState({
      selectedOption: e.target.value
    });
  };

  render() {
    let { allCycles, loading } = this.props.cycles;

    let cyclesList = "";
    let newCycle;

    const { cycle } = this.props.cycles;
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
    if (this.props.auth.user.type === "Admin") {
      if (allCycles === null || loading) {
        cyclesList = <option>Loading...</option>;
      } else {
        //   Check if logged in user has cycles to view
        if (Object.keys(allCycles).length > 0) {
          cyclesList = allCycles.map(value => (
            <option
              key={value.Cycle_ID}
              value={value.Cycle_ID}
              id={value.Cycle_ID}
            >
              {value.Cycle_Name}
            </option>
          ));
        } else {
          cyclesList = (
            <div>
              <br />
              <h4>There is no cycles to view for you!</h4>
              <Link to="/dashboard">
                <Button variant="info">Return to Dashboard</Button>
              </Link>
              <br />
              <br />
            </div>
          );
        }

        newCycle = (
          <></>
          // <Card.Footer
          //   onClick={() => this.setState({ modalShow: true })}
          //   style={{ cursor: "pointer" }}
          // >
          //   <FontAwesomeIcon icon="plus" />
          //   &nbsp;&nbsp;&nbsp;Create a new cycle
          // </Card.Footer>
        );
      }
    }
    return (
      <div>
        <Card className="text-center">
          <Card.Header>Active Cycle</Card.Header>
          <Card.Body style={{ padding: "0px" }}>
            <select
              name="cycles"
              className="custom-select"
              onChange={this.onSelectChange.bind(this)}
              value={this.state.selectedOption}
            >
              {cyclesList}
            </select>
          </Card.Body>
          {newCycle}
        </Card>

        <Card className="text-center cycle">
          <Card.Header>List of Outcomes</Card.Header>

          <ListGroup variant="flush">{outcomes}</ListGroup>

          <Card.Footer className="text-muted">2 days ago</Card.Footer>
        </Card>
      </div>
    );
  }
}
Cycles.propTypes = {
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
  { getCycles, getSingleCycle }
)(Cycles);
