import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { getSingleCycle } from "../../actions/cycleActions";
import { createMeasure } from "../../actions/measureActions";
import { Card, ListGroup, Button, FormControl, Form } from "react-bootstrap";
import Spinner from "../../common/Spinner";
import { getMeasures } from "../../actions/measureActions";
import classnames from "classnames";
import isEmpty from "../../validation/isEmpty";
import EditableMeasureList from "./EditableMeasureList";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus);

class ShowMeasures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMeasure: "",
      newMeasureType: "rubric",
      showNewMeasure: false,
      errors: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      this.setState({
        errors: this.props.errors
      });
    }

    if (this.props.match.params.outcomeID) {
      if (
        this.props.match.params.outcomeID !== prevProps.match.params.outcomeID
      ) {
        this.props.getMeasures(this.props.match.params.outcomeID);
      }
      console.log(this.props.match.params.outcomeID);
    }
  }

  componentDidMount() {
    if (this.props.match.params.outcomeID) {
      console.log(this.props.match.params.outcomeID);
      this.props.getMeasures(this.props.match.params.outcomeID);
    }
  }

  createNewMeasure = () => {
    this.setState({
      showNewMeasure: true
    });
  };

  saveButtonHandler = () => {
    let { newMeasure, newMeasureType } = this.state;
    let { outcomeID } = this.props.match.params;
    if (newMeasureType) {
      this.props.createMeasure(outcomeID, newMeasure, newMeasureType);
      this.setState({
        showNewMeasure: false,
        newMeasure: ""
      });
    }
  };

  render() {
    let { measure, loading } = this.props.measures;
    let { id, outcomeID } = this.props.match.params;
    let measures = "";
    if (loading || isEmpty(measure)) {
      measures = <Spinner />;
    } else if (measure.data) {
      measures = measure.data.map(value => (
        <EditableMeasureList
          value={value}
          key={value.Measure_ID}
          id={id}
          outcomeID={outcomeID}
        />
      ));
    } else {
      measures = <ListGroup.Item>This measure does not exist</ListGroup.Item>;
    }
    return (
      <div>
        <Card className="text-center cycle">
          <Card.Header>List of Measures</Card.Header>

          <ListGroup variant="flush">{measures}</ListGroup>
          {this.state.showNewMeasure ? (
            <Form className="create">
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Name of the measure:</Form.Label>
                <FormControl
                  name="new-outcome"
                  as="textarea"
                  aria-label="With textarea"
                  value={this.state.newMeasure}
                  placeholder="Enter new measure"
                  onChange={e => this.setState({ newMeasure: e.target.value })}
                  className={classnames("", {
                    "is-invalid": this.state.errors.Measure_Name
                  })}
                />
                <FormControl.Feedback type="invalid">
                  {this.state.errors.Measure_Name}
                </FormControl.Feedback>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Type of the measure</Form.Label>
                <FormControl
                  as="select"
                  onChange={e =>
                    this.setState({ newMeasureType: e.target.value })
                  }
                  value={this.state.newMeasureType}
                >
                  <option value="rubric">Rubric</option>
                  <option value="test">Test</option>
                </FormControl>
              </Form.Group>
              <Button variant="primary" onClick={this.saveButtonHandler}>
                Save
              </Button>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({ showNewMeasure: false, errors: "" });
                }}
              >
                Cancel
              </Button>
            </Form>
          ) : null}
          <Card.Footer
            style={{ cursor: "pointer" }}
            onClick={this.createNewMeasure.bind(this)}
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;&nbsp;&nbsp;Create a new measure
          </Card.Footer>
        </Card>
      </div>
    );
  }
}

ShowMeasures.propTypes = {
  getMeasures: PropTypes.func.isRequired
  // measures: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  measures: state.measures
});

export default connect(
  mapStateToProps,
  { getMeasures, createMeasure }
)(ShowMeasures);
