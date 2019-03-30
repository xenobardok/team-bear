import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Badge,
  OverlayTrigger,
  Tooltip,
  InputGroup,
  FormControl,
  Form
} from "react-bootstrap";
import { getEvaluators } from "../../actions/profileActions";
import {
  getSingleMeasure,
  assignEvaluatorToMeasure
} from "../../actions/measureActions";
import { getRubrics, getSingleRubric } from "../../actions/rubricsActions";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import EvaluatorBox from "./EvaluatorBox";
import Stats from "./Stats";
import DefineMeasure from "./DefineMeasure";
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
      allEvaluators: [],
      rubricScales: []
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
          Rubric_Name: singleMeasure.Rubric_Name,
          Class_Name: singleMeasure.Class_Name
        });
      }
    }

    if (this.props.profile.evaluators !== prevProps.profile.evaluators) {
      console.log(this.props.profile.evaluators);
      this.setState({
        allEvaluators: this.props.profile.evaluators
      });
    }

    if (this.props.rubrics.allRubrics !== prevProps.rubrics.allRubrics) {
      this.setState({
        allRubrics: this.props.rubrics.allRubrics
      });
    }

    if (this.props.rubrics.rubric !== prevProps.rubrics.rubric) {
      this.setState({
        rubricScales: this.props.rubrics.rubric.Scale
      });
    }
  };

  componentDidMount() {
    let { outcomeID, measureID } = this.props.match.params;
    this.props.getSingleMeasure(outcomeID, measureID);
    this.props.getEvaluators();
    this.props.getRubrics();
  }

  getSingleRubricScale = id => {
    this.props.getSingleRubric(id);
  };
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
      newEvaluator,
      Class_Name
    } = this.state;

    let measure;
    if (newEvaluator) {
      newEvaluatorBox = (
        <EvaluatorBox
          addEvaluator={this.addEvaluator}
          values={this.state.allEvaluators}
          addButtonEvaluator={this.addButtonEvaluator}
        />
      );
    }
    if (loading || isEmpty(singleMeasure)) {
      measure = <Spinner />;
    } else {
      measure = (
        <div>
          <div className="measure-label">
            <Badge variant="primary">
              <span style={{ fontWeight: "400" }}>Measure Label</span>
            </Badge>
            <br />
            <h3>{Measure_Label ? Measure_Label : null}</h3>
          </div>
          <br />
          <DefineMeasure
            Threshold={Threshold}
            Rubric_Name={Rubric_Name}
            Target={Target}
            allRubrics={this.state.allRubrics}
            getSingleRubricScale={this.getSingleRubricScale}
            rubricScales={this.state.rubricScales}
            Class_Name={this.state.Class_Name}
          />
          <br />
          <Stats
            Achieved_Threshold={Achieved_Threshold}
            Is_Success={Is_Success}
            Total_Students={Total_Students}
            Student_Achieved_Target_Count={Student_Achieved_Target_Count}
          />
          <br />

          <section id="evaluators">
            <span style={{ float: "right", fontSize: "1.25rem" }}>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={<Tooltip id="add-evaluator">Add Evaluator</Tooltip>}
              >
                <FontAwesomeIcon
                  icon="user-plus"
                  onClick={this.addEvaluator}
                  className="addEvaluatorIcon"
                />
              </OverlayTrigger>
            </span>
            <h5>Evaluators</h5>
            <div className="evaluators">
              {Evaluators
                ? Evaluators.map(value => (
                    <EvaluatorBox key={value.Evaluator_Name} {...value} />
                  ))
                : null}

              {newEvaluatorBox}
            </div>
          </section>
          <br />
          <h5>Students</h5>
          <ul>
            {!isEmpty(Students) ? (
              Students.map(value => (
                <li key={value.Student_Name}>
                  {value.Student_Name} : {value.Student_ID}
                </li>
              ))
            ) : (
              <li>No Students added to this measure yet!</li>
            )}
          </ul>
        </div>
      );
    }
    return <Container className="single-measure">{measure}</Container>;
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
  profile: state.profile,
  rubrics: state.rubrics
});

export default connect(
  mapStateToProps,
  {
    getSingleMeasure,
    getEvaluators,
    assignEvaluatorToMeasure,
    getRubrics,
    getSingleRubric
  }
)(Measure);
