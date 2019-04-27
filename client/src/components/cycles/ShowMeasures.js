import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Card,
  ListGroup,
  Button,
  FormControl,
  Form,
  ButtonGroup
} from "react-bootstrap";
import Spinner from "../../common/Spinner";
import {
  getMeasures,
  deleteMeasure,
  createMeasure,
  updateMeasureLabel
} from "../../actions/measureActions";
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
    let { id, outcomeID } = this.props.match.params;
    if (this.props.errors !== prevProps.errors) {
      this.setState({
        errors: this.props.errors
      });
    }

    if (outcomeID) {
      if (outcomeID !== prevProps.match.params.outcomeID) {
        this.props.getMeasures(id, outcomeID);
      }
    }
  }

  componentDidMount() {
    let { id, outcomeID } = this.props.match.params;
    if ((id, outcomeID)) {
      this.props.getMeasures(id, outcomeID);
    }
  }

  createNewMeasure = () => {
    this.setState({
      showNewMeasure: true
    });
  };

  saveButtonHandler = () => {
    let { newMeasure, newMeasureType } = this.state;
    let { id, outcomeID } = this.props.match.params;
    if (newMeasureType) {
      this.props.createMeasure(id, outcomeID, newMeasure, newMeasureType);
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
    let footer = "";
    if (loading || isEmpty(measure)) {
      measures = <Spinner />;
    } else if (measure.data) {
      measures = measure.data.map(value => (
        <EditableMeasureList
          value={value}
          key={value.Measure_ID}
          id={id}
          outcomeID={outcomeID}
          updateMeasureLabel={this.props.updateMeasureLabel}
          measureID={value.Measure_ID}
          deleteMeasure={this.props.deleteMeasure}
          Is_Submitted={measure.Is_Submitted}
          Outcome_Index={measure.Outcome_Index}
        />
      ));

      footer =
        measure.Is_Submitted === "false" ? (
          <Card.Footer
            style={{ cursor: "pointer" }}
            onClick={this.createNewMeasure.bind(this)}
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;&nbsp;&nbsp;Create a new measure
          </Card.Footer>
        ) : null;
    } else {
      measures = <ListGroup.Item>This measure does not exist</ListGroup.Item>;
    }
    return (
      <div>
        <Card className="text-center cycle">
          <Card.Header>List of Measures</Card.Header>

          <Card.Body style={{ padding: "0px" }}>
            <ListGroup variant="flush">
              {measures}
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
                      onChange={e =>
                        this.setState({ newMeasure: e.target.value })
                      }
                      className={classnames("mt-1 ml-1 mr-1", {
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

                  <ButtonGroup size="sm" className="mt-1">
                    <Button variant="primary" onClick={this.saveButtonHandler}>
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        this.setState({ showNewMeasure: false, errors: "" });
                      }}
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
  { getMeasures, createMeasure, updateMeasureLabel, deleteMeasure }
)(ShowMeasures);
