import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getSingleRubric,
  setDataValue,
  setMeasureValue,
  changeRubricWeight
} from "../../actions/rubricsActions";
import { Table, FormControl, Button } from "react-bootstrap";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";

let scalesRow, dataRow;

class AnalyseRubric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: [],
      weightChange: false
    };
  }

  calculateTotalWeight() {
    let total = 0;
    this.state.weight.forEach(element => (total += element.Rubric_Row_Weight));
    return total;
  }

  componentDidMount() {
    let newWeight = [];
    this.props.data.forEach(element => {
      newWeight.push({
        Rubric_Row_ID: element.Rubric_Row_ID,
        Rubric_Row_Weight: element.Rubric_Row_Weight
      });
    });

    this.setState({
      weight: newWeight
    });
  }

  onChangeMeasure = event => {
    this.props.setMeasureValue(event.target.name, event.target.value);
  };
  onChangeDataValue = event => {
    this.props.setDataValue(event.target.name, event.target.value);
  };

  onWeightChange = (index, event) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      let weightArray = [...this.state.weight];
      weightArray[index] = {
        ...weightArray[index],
        Rubric_Row_Weight: Number(event.target.value)
      };
      this.setState({
        weight: weightArray,
        weightChange: true
      });
    }
  };

  weightChangeButton = () => {
    this.props.changeRubricWeight(this.props.Rubric_ID, this.state.weight);
  };
  render() {
    scalesRow = this.props.Scale.map(singleValue => (
      <th key={singleValue.value} className="centerAlign borderedCell">
        {singleValue.label ? singleValue.label : singleValue.value}
        {/* {singleValue.label + " (" + singleValue.value + ")"} */}
      </th>
    ));

    dataRow = this.props.data.map((singleRow, index) => (
      <tr key={singleRow.Rubric_Row_ID}>
        <td className="borderedCell">
          <FormControl
            name={singleRow.Rubric_Row_ID}
            as="textarea"
            aria-label="With textarea"
            onChange={this.onChangeMeasure.bind(this)}
            defaultValue={singleRow.Measure_Factor}
            className="measureTitle centerAlign cells"
          />
        </td>
        {singleRow.Column_values.map(cell => (
          <td key={cell.Column_ID} className="borderedCell">
            <FormControl
              name={cell.Column_ID}
              as="textarea"
              aria-label="With textarea"
              onChange={this.onChangeDataValue.bind(this)}
              defaultValue={cell.value}
              className="cells"
            />
          </td>
        ))}
        {this.props.isWeighted === "true" && !isEmpty(this.state.weight) ? (
          <td>
            <FormControl
              name={"weight[" + index + "].Rubric_Row_Weight"}
              as="textarea"
              aria-label="With textarea"
              onChange={this.onWeightChange.bind(this, index)}
              value={this.state.weight[index].Rubric_Row_Weight}
              className="weight centerAlign cells"
            />
          </td>
        ) : null}
      </tr>
    ));
    return (
      <div key={this.props.Rubric_ID}>
        <h2>{this.props.Rubric_Name}</h2>
        <br />
        <Table bordered striped>
          <thead>
            <tr className="header">
              <th
                key="Criteria"
                className="measureTitle centerAlign borderedCell"
              >
                Criteria
              </th>
              {scalesRow}
              {this.props.isWeighted === "true" &&
              !isEmpty(this.state.weight) ? (
                <th className="weight centerAlign borderedCell">
                  Weight({this.calculateTotalWeight()})
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>{dataRow}</tbody>
        </Table>
        {this.state.weightChange ? (
          <div style={{ textAlign: "center", animation: "1s all" }}>
            <Button variant="primary" onClick={this.weightChangeButton}>
              Change Weight
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

class ShowRubric extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getSingleRubric(this.props.match.params.id);
    }
  }
  render() {
    let { rubric, loading } = this.props.rubrics;
    let displayRubric = "";
    if (loading) {
      displayRubric = <Spinner />;
    } else {
      // Check if logged in user has rubrics to view
      if (rubric) {
        displayRubric = (
          <AnalyseRubric
            key={rubric.Rubric_ID}
            {...rubric}
            setMeasureValue={this.props.setMeasureValue}
            setDataValue={this.props.setDataValue}
            changeRubricWeight={this.props.changeRubricWeight}
          />
        );
      } else {
        displayRubric = <h2>Rubric not found!</h2>;
      }
    }
    return <div className="show-rubric">{displayRubric}</div>;
  }
}

// export default ShowRubric;
ShowRubric.propTypes = {
  setMeasureValue: PropTypes.func.isRequired,
  getSingleRubric: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  rubrics: state.rubrics
});

export default connect(
  mapStateToProps,
  { getSingleRubric, setMeasureValue, setDataValue, changeRubricWeight }
)(ShowRubric);
