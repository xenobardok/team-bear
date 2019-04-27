import React, { Component } from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getSingleCycle,
  createNewOutcome,
  updateOutcome,
  deleteOutcome
} from "../../actions/cycleActions";
import { getMeasures } from "../../actions/measureActions";
import {
  Card,
  ListGroup,
  Button,
  FormControl,
  ButtonGroup,
  Form
} from "react-bootstrap";
import Spinner from "../../common/Spinner";
import ShowMeasures from "./ShowMeasures";
import classnames from "classnames";
import EditableOutcomeList from "./EditableOutcomeList";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faEdit);

class ShowCycle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newOutcome: "",
      showNewOutcome: false,
      errors: "",
      allOutcomes: "",
      curriculumMap: ""
    };
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getSingleCycle(this.props.match.params.id);
    }
    if (this.props.auth.user.type !== "Admin") {
      this.props.history.push("/dashboard");
    }
  }

  onClickHandler = e => {
    console.log(e.target.name);
    this.props.history.push(
      "/dashboard/cycles/" +
        this.props.cycles.cycle.Cycle_ID +
        "/outcome/" +
        this.props.measures.measure.Outcome_ID
    );
  };

  createNewOutcome = e => {
    this.setState({
      showNewOutcome: true,
      errors: ""
    });
  };

  cancelButtonHandler = e => {
    this.setState({
      showNewOutcome: false,
      errors: "",
      newOutcome: "",
      curriculumMap: ""
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
      this.state.newOutcome,
      this.state.curriculumMap
    );
  };

  render() {
    const { cycle, loading, allCycles } = this.props.cycles;
    let outcomes = "";
    let cycleName = "";
    let footer = "";
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
            key={value.Outcome_ID}
            cycleID={this.props.cycles.cycle.Cycle_ID}
            updateOutcome={this.props.updateOutcome}
            errors={this.props.errors}
            deleteOutcome={this.props.deleteOutcome}
            Is_Submitted={cycle.Is_Submitted}
          />
        ));
      }

      footer =
        cycle.Is_Submitted === "false" ? (
          <Card.Footer
            style={{ cursor: "pointer" }}
            onClick={this.createNewOutcome}
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;&nbsp;&nbsp;Create a new outcome
          </Card.Footer>
        ) : null;
    }

    return (
      <div className="cycle-view">
        <h2>{cycleName}</h2>
        <div className="cycle-outcome">
          <div>
            <Card className="text-center cycle">
              <Card.Header>List of Outcomes</Card.Header>
              <Card.Body style={{ padding: "0px" }}>
                <ListGroup variant="flush">
                  {outcomes}
                  {this.state.showNewOutcome ? (
                    <Form className="create">
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Name of the outcome:</Form.Label>
                        <FormControl
                          name="new-outcome"
                          as="textarea"
                          aria-label="With textarea"
                          value={this.state.newOutcome}
                          placeholder="Enter new Outcome"
                          onChange={e =>
                            this.setState({ newOutcome: e.target.value })
                          }
                          className={classnames("mt-1 ml-1 mr-1", {
                            "is-invalid": this.state.errors.Outcome_Name
                          })}
                        />
                        <FormControl.Feedback type="invalid">
                          {this.state.errors.Outcome_Name}
                        </FormControl.Feedback>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Curriculum Mapping</Form.Label>
                        <FormControl
                          name="new-curriculum"
                          as="textarea"
                          aria-label="With textarea"
                          value={this.state.curriculumMap}
                          placeholder="(Optional) Curriculum responsible for this outcome"
                          onChange={e =>
                            this.setState({ curriculumMap: e.target.value })
                          }
                          className={classnames("mt-1 ml-1 mr-1", {
                            "is-invalid": this.state.errors.Outcome_Name
                          })}
                        />
                      </Form.Group>
                      <ButtonGroup size="sm" className="mt-1 mb-1">
                        <Button
                          variant="primary"
                          onClick={this.saveButtonHandler}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={this.cancelButtonHandler}
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </Form>
                  ) : null}
                </ListGroup>
              </Card.Body>
              {footer}
            </Card>
          </div>
          <Route
            exact
            path="/dashboard/cycles/:id(\d+)/outcome/:outcomeID(\d+)"
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
  {
    getSingleCycle,
    getMeasures,
    createNewOutcome,
    updateOutcome,
    deleteOutcome
  }
)(ShowCycle);
