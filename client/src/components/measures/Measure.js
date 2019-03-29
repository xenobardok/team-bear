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
import { getEvaluators } from "../../actions/profileActions";
import {
  getSingleMeasure,
  assignEvaluatorToMeasure
} from "../../actions/measureActions";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import EvaluatorBox from "./EvaluatorBox";
import Stats from "./Stats";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faUserPlus } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faEdit, faUserPlus);

class Measure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      newEvaluator: false,
      allEvaluators: []
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props.measures) {
      if (
        this.props.measures.singleMeasure !== prevProps.measures.singleMeasure
      ) {
        let { singleMeasure } = this.props.measures;
        this.setState({
          Measure_Label: singleMeasure.Measure_Label,
          Measure_Type: singleMeasure.Measure_Type,
          Target: singleMeasure.Target,
          Threshold: singleMeasure.Threshold,
          Achieved_Threshold: singleMeasure.Achieved_Threshold,
          Is_Success: singleMeasure.Is_Success,
          Total_Students: singleMeasure.Total_Students,
          Student_Achieved_Target_Count:
            singleMeasure.Student_Achieved_Target_Count,
          Evaluators: singleMeasure.Evaluators,
          Students: singleMeasure.Students,
          Rubric_Name: singleMeasure.Rubric_Name
        });
      }
    }

    if (this.props.profile.evaluators !== prevProps.profile.evaluators) {
      console.log(this.props.profile.evaluators);
      this.setState({
        allEvaluators: this.props.profile.evaluators
      });
    }
  };

  componentDidMount() {
    let { outcomeID, measureID } = this.props.match.params;
    this.props.getSingleMeasure(outcomeID, measureID);
    this.props.getEvaluators();
  }

  addEvaluator = () => {
    this.setState({
      newEvaluator: !this.state.newEvaluator
    });
  };

  addButtonEvaluator = email => {
    console.log(this.props.match.params.measureID, email);
    if (!isEmpty(email)) {
      this.props.assignEvaluatorToMeasure(
        this.props.match.params.measureID,
        email
      );
    }
  };
  render() {
    let newEvaluatorBox;
    let { loading, singleMeasure } = this.props.measures;
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
      Student_Achieved_Target_Count,
      newEvaluator
    } = this.state;

    let measure;
    if (loading || isEmpty(singleMeasure)) {
      measure = <Spinner />;
    } else {
      // Measure_Label = stateMeasure.Measure_Label;
      // Measure_Type = stateMeasure.Measure_Type;
      // Target = stateMeasure.Target;
      // Threshold = stateMeasure.Threshold;
      // Achieved_Threshold = stateMeasure.Achieved_Threshold;
      // Is_Success = stateMeasure.Is_Success;
      // Evaluators = stateMeasure.Evaluator;
      // Students = stateMeasure.Students;
      // Rubric_Name = stateMeasure.Rubric_Name;
      // End_Date = stateMeasure.End_Date;
      // Total_Students = stateMeasure.Total_Students;
      // Student_Achieved_Target_Count =
      //   stateMeasure.Student_Achieved_Target_Count;
    }

    if (newEvaluator) {
      newEvaluatorBox = (
        <EvaluatorBox
          addEvaluator={this.addEvaluator}
          values={this.state.allEvaluators}
          addButtonEvaluator={this.addButtonEvaluator}
        />
      );
    }
    return (
      <Container>
        <div>
          <div className="measure-label">
            <Badge variant="primary">
              <span style={{ fontWeight: "400" }}>Measure Label</span>
            </Badge>
            <br />
            <h3>{Measure_Label ? Measure_Label : null}</h3>
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
                <Form.Control
                  as="select"
                  aria-describedby="rubric"
                  defaultValue={this.state.Rubric_Name}
                >
                  {Rubric_Name ? (
                    <option value="">{Rubric_Name}</option>
                  ) : (
                    <>
                      <option value="choose" disabled>
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
          <Stats
            Achieved_Threshold={Achieved_Threshold}
            Is_Success={Is_Success}
            Total_Students={Total_Students}
            Student_Achieved_Target_Count={Student_Achieved_Target_Count}
          />
          <br />

          <section id="evaluators">
            <h5>
              Evaluators
              <span style={{ float: "right" }}>
                <FontAwesomeIcon
                  icon="user-plus"
                  onClick={this.addEvaluator}
                  className="addEvaluatorIcon"
                />
              </span>
            </h5>
            <div className="evaluators">
              {Evaluators
                ? Evaluators.map(value => <EvaluatorBox {...value} />)
                : null}

              {newEvaluatorBox}
            </div>
          </section>
          <br />
          <h5>Students</h5>
          <ul>
            {Students
              ? Students.map(value => (
                  <li>
                    {value.Student_Name} : {value.Student_ID}
                  </li>
                ))
              : null}
          </ul>
          <br />
          <p>
            Rubric Associated with this measure: <strong>{Rubric_Name}</strong>
          </p>
        </div>
      </Container>
    );
  }
}

Measure.propTypes = {
  getSingleMeasure: PropTypes.func.isRequired,
  measures: PropTypes.object.isRequired,
  getEvaluators: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  measures: state.measures,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getSingleMeasure, getEvaluators, assignEvaluatorToMeasure }
)(Measure);
