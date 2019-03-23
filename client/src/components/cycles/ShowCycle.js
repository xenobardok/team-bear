import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSingleCycle, createNewOutcome } from "../../actions/cycleActions";
import { getMeasures } from "../../actions/measureActions";
import { Card, ListGroup, Button, FormControl } from "react-bootstrap";
import Spinner from "../../common/Spinner";
import ShowMeasures from "./ShowMeasures";
import classnames from "classnames";
import EditableOutcomeList from "./EditableOutcomeList";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faEdit);

let createOutcome;
class ShowCycle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newOutcome: "",
      showNewOutcome: false,
      errors: "",
      allOutcomes: ""
    };
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getSingleCycle(this.props.match.params.id);
    }
    if (this.props.auth.user.type === "Evaluator") {
      this.props.history.push("/dashboard");
    }
  }

  onClickHandler = e => {
    console.log(e.target.name);
    this.props.getMeasures(e.target.name);
  };

  createNewOutcome = e => {
    this.setState({
      showNewOutcome: true
    });
  };

  componentDidUpdate = prevProps => {
    if (this.props.errors) {
      if (prevProps.errors !== this.props.errors) {
        this.setState({
          errors: this.props.errors
        });
      }
    } else {
      this.setState({
        errors: ""
      });
    }
    if (this.props.cycles.cycle) {
      if (this.props.measures !== prevProps.measures) {
        this.props.history.push(
          "/dashboard/cycles/" +
            this.props.cycles.cycle.Cycle_ID +
            "/outcome/" +
            this.props.measures.measure.Outcome_ID
        );
      }
    }

    if (this.props.cycles.cycle !== prevProps.cycles.cycle) {
      this.setState({
        allOutcomes: this.props.cycles.cycle,
        showNewOutcome: false,
        newOutcome: "",
        errors: ""
      });
    }
  };
  saveButtonHandler = e => {
    // e.preventDefault();
    // console.log(this.state.newOutcome);
    this.props.createNewOutcome(
      this.props.match.params.id,
      this.state.newOutcome
    );
  };

  render() {
    const { cycle, loading, allCycles } = this.props.cycles;
    let outcomes = "";
    let cycleName = "";
    createOutcome = (
      <Card.Footer
        style={{ cursor: "pointer" }}
        onClick={this.createNewOutcome.bind(this)}
      >
        <FontAwesomeIcon icon="plus" />
        &nbsp;&nbsp;&nbsp;Create a new outcome
      </Card.Footer>
    );
    if (loading) {
      outcomes = <Spinner />;
    } else if (cycle === null) {
      outcomes = <h1>CYCLE NOT FOUND</h1>;
    } else {
      cycleName = cycle.Cycle_Name;
      if (Object.keys(this.state.allOutcomes).length > 0) {
        outcomes = this.state.allOutcomes.data.map(value => (
          <EditableOutcomeList
            value={value}
            onClickHandler={this.onClickHandler}
            key={value.Outcome_ID}
            cycleID={this.props.cycles.cycle.Cycle_ID}
          />
          // <ListGroup key={value.Outcome_ID} className="edit-post">
          //   <ListGroup.Item
          //     action
          //     name={value.Outcome_ID}
          //     onClick={this.onClickHandler}
          //   >
          //     {value.Outcome_Name}
          //   </ListGroup.Item>
          //   <div
          //     style={{
          //       display: "inline",
          //       alignSelf: "center",
          //       padding: "0px 5px"
          //     }}
          //     onClick={this.editHandler}
          //   >
          //     <FontAwesomeIcon icon="edit" />
          //   </div>
          // </ListGroup>
        ));
      }
    }

    return (
      <div className="cycle-view">
        <h2>{cycleName}</h2>
        <div className="cycle-outcome">
          <div>
            <Card className="text-center cycle">
              <Card.Header>List of Outcomes</Card.Header>

              <ListGroup variant="flush">{outcomes}</ListGroup>
              {this.state.showNewOutcome ? (
                <div>
                  <FormControl
                    name="new-outcome"
                    as="textarea"
                    aria-label="With textarea"
                    value={this.state.newOutcome}
                    placeholder="Enter new Outcome"
                    onChange={e =>
                      this.setState({ newOutcome: e.target.value })
                    }
                    className={classnames("", {
                      "is-invalid": this.state.errors.Outcome_Name
                    })}
                  />
                  <FormControl.Feedback type="invalid">
                    {this.state.errors.Outcome_Name}
                  </FormControl.Feedback>
                  <Button variant="primary" onClick={this.saveButtonHandler}>
                    Save
                  </Button>
                  &nbsp;
                  <Button
                    variant="primary"
                    onClick={() => {
                      this.setState({ showNewOutcome: false });
                      this.setState({ errors: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : null}
              {createOutcome}
            </Card>
          </div>
          <Route
            exact
            path="/dashboard/cycles/:id(\d+)/outcome/:measureID(\d+)"
            component={ShowMeasures}
          />
        </div>
      </div>
    );
  }
}

ShowCycle.propTypes = {
  getSingleCycle: PropTypes.func.isRequired,
  getMeasures: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  cycles: state.cycles,
  measures: state.measures
});

export default connect(
  mapStateToProps,
  { getSingleCycle, getMeasures, createNewOutcome }
)(ShowCycle);
