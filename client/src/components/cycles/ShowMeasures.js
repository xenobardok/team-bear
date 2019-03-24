import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSingleCycle } from "../../actions/cycleActions";
import { Card, ListGroup, Button, FormControl } from "react-bootstrap";
import Spinner from "../../common/Spinner";
import { getMeasures } from "../../actions/measureActions";
import classnames from "classnames";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus);

class ShowMeasures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewMeasure: false,
      errors: ""
    };
  }

  componentDidMount() {
    if (this.props.match.params.measureID) {
      this.props.getMeasures(this.props.match.params.measureID);
    }
  }

  createNewMeasure = () => {
    this.setState({
      showNewMeasure: true
    });
  };

  saveButtonHandler = () => {};
  render() {
    let { measure, loading } = this.props.measures;
    let measures = "";
    if (loading) {
      measures = <Spinner />;
    } else if (measure.data) {
      measures = measure.data.map(value => (
        <ListGroup.Item key={value.Measure_ID}>
          {value.Measure_Name}
        </ListGroup.Item>
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
            <div>
              <FormControl
                name="new-outcome"
                as="textarea"
                aria-label="With textarea"
                value={this.state.newOutcome}
                placeholder="Enter new measure"
                onChange={e => this.setState({ newOutcome: e.target.value })}
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
                  this.setState({ showNewMeasure: false });
                  this.setState({ errors: "" });
                }}
              >
                Cancel
              </Button>
            </div>
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
  { getMeasures }
)(ShowMeasures);
