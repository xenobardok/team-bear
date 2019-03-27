import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";
import { getSingleMeasure } from "../../actions/measureActions";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";

class Measure extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate = prevProps => {
    if (this.props.measures) {
      if (
        this.props.measures.singleMeasure !== prevProps.measures.singleMeasure
      ) {
        this.setState({
          Measure_Label: this.props.measures.singleMeasure.Measure_Label,
          Measure_Type: this.props.measures.singleMeasure.Measure_Type,
          Target: this.props.measures.singleMeasure.Target,
          Threshold: this.props.measures.singleMeasure.Threshold,
          Achieved_Threshold: this.props.measures.singleMeasure
            .Achieved_Threshold,
          Is_Success: this.props.measures.singleMeasure.Is_Success,
          Total_Students: this.props.measures.singleMeasure.Total_Students,
          Students_Achieved_Target_Count: this.props.measures.singleMeasure
            .Students_Achieved_Target_Count,
          Evaluators: this.props.measures.singleMeasure.Evaluators,
          Students: this.props.measures.singleMeasure.Students,
          Rubric_Name: this.props.measures.singleMeasure.Rubric_Name
        });
      }
    }
    if (this.props.measure !== prevProps.measure) {
    }
  };

  componentDidMount() {
    let { outcomeID, measureID } = this.props.match.params;
    this.props.getSingleMeasure(outcomeID, measureID);
  }
  render() {
    let { loading, singleMeasure } = this.props.measures;

    let measure;
    if (loading || isEmpty(singleMeasure)) {
      measure = <Spinner />;
    } else {
      let {
        Measure_Label,
        Measure_Type,
        Target,
        Threshold,
        Achieved_Threshold,
        Is_Success,
        Evaluators,
        Students,
        Rubric_Name,
        End_Date,
        Total_Students,
        Student_Achieved_Target_Count
      } = this.props.measures.singleMeasure;
      measure = (
        <div>
          <h3>{Measure_Label}</h3>
          <br />
          <h5>Measure Definition</h5>
          <ul>
            <li>Measure Type: {Measure_Type}</li>
            <li>Target: {Target}</li>
            <li>Threshold: {Threshold}</li>
            <li>Deadline: {End_Date}</li>
          </ul>
          <br />
          <h5>Stats:</h5>
          <ul>
            <li>Achieved Threshold: {Achieved_Threshold}</li>
            <li>Measure Success: {Is_Success}</li>
            <li>Total Students: {Total_Students}</li>
            <li>
              Count of students who achieved target:{" "}
              {Student_Achieved_Target_Count}
            </li>
          </ul>
          <br />
          <h5>Evaluators</h5>
          <ul>
            {Evaluators.map(value => (
              <li>
                {value.Evaluator_Name} : {value.Evaluator_Email}
              </li>
            ))}
          </ul>
          <br />
          <h5>Students</h5>
          <ul>
            {Students.map(value => (
              <li>
                {value.Student_Name} : {value.Student_ID}
              </li>
            ))}
          </ul>
          <br />
          <p>
            Rubric Associated with this measure: <strong>{Rubric_Name}</strong>
          </p>
        </div>
      );
    }
    return <Container>{measure}</Container>;
  }
}

Measure.propTypes = {
  getSingleMeasure: PropTypes.func.isRequired,
  measures: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  measures: state.measures
});

export default connect(
  mapStateToProps,
  { getSingleMeasure }
)(Measure);
