import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Badge,
  InputGroup,
  FormControl,
  Form
} from "react-bootstrap";
import { getSingleMeasure } from "../../actions/measureActions";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faEdit);

class Measure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
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
          <div className="measure-label">
            <Badge variant="primary">
              <span style={{ fontWeight: "400" }}>Measure Label</span>
            </Badge>
            <br />
            <h3>{Measure_Label}</h3>
          </div>
          <br />
          <Badge variant="success">
            <span style={{ fontWeight: "400" }}>Important</span>
          </Badge>
          <h5>Measure Definition</h5>
          <div className="label-defination px-2">
            {Threshold && !this.state.isEditing ? (
              <span>
                <strong>{Threshold}</strong> %
              </span>
            ) : (
              <InputGroup className="mb-3 small px-2">
                <FormControl
                  placeholder="Eg. 75"
                  aria-label="percentage"
                  aria-describedby="percentage"
                  defaultValue={Threshold ? Threshold : ""}
                />
                <InputGroup.Append>
                  <InputGroup.Text id="percentage">%</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            )}
            <span> of students evaluated on </span>
            {Rubric_Name && !this.state.isEditing ? (
              <span>
                <strong>{Rubric_Name}</strong> rubric
              </span>
            ) : (
              <InputGroup className="mb-3 rubric px-2">
                <Form.Control as="select" aria-describedby="rubric">
                  {Rubric_Name ? (
                    <option value="" selected>
                      {Rubric_Name}
                    </option>
                  ) : (
                    <>
                      <option value="" disabled selected>
                        Choose a Rubric
                      </option>
                      <option>...</option>
                    </>
                  )}
                </Form.Control>
                <InputGroup.Append>
                  <InputGroup.Text id="rubric">Rubric</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            )}
            <span> of </span>
            {Target && !this.state.isEditing ? (
              <span>
                <strong>{Target}</strong>
              </span>
            ) : (
              <InputGroup className=" mb-3 target px-2">
                <Form.Control as="select" aria-describedby="target">
                  {Target ? (
                    <option value={Target} selected>
                      {Target}
                    </option>
                  ) : (
                    <>
                      <option value="" disabled selected>
                        Choose a Rubric
                      </option>
                      <option>...</option>
                    </>
                  )}
                </Form.Control>
              </InputGroup>
            )}
            <span> or better.</span>
          </div>
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
              <li key={value.Evaluator_Email}>
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
