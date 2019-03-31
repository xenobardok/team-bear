import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getSingleRubric,
  setDataValue,
  setMeasureValue
} from "../../actions/rubricsActions";
import { Table, FormControl } from "react-bootstrap";
import Spinner from "../../common/Spinner";
// import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

let scalesRow, dataRow;

class AnalyseRubric extends Component {
  render() {
    scalesRow = this.props.Scale.map(singleValue => (
      <th key={singleValue.value} className="centerAlign borderedCell">
        {singleValue.label + " (" + singleValue.value + ")"}
      </th>
    ));

    dataRow = this.props.data.map(singleRow => (
      <tr key={singleRow.Rubric_Row_ID}>
        <td className="borderedCell">
          <FormControl
            name={singleRow.Rubric_Row_ID}
            as="textarea"
            aria-label="With textarea"
            defaultValue={singleRow.Measure_Factor}
            className="measureTitle centerAlign cells"
            disabled
          />
        </td>
        {singleRow.Column_values.map(cell => (
          <td key={cell.Column_ID} className="borderedCell">
            <FormControl
              name={cell.Column_ID}
              as="textarea"
              aria-label="With textarea"
              defaultValue={cell.value}
              className="cells"
              disabled
            />
          </td>
        ))}
        <td className="borderedCell">
          <FormControl
            name={singleRow.Rubric_Row_ID}
            as="textarea"
            aria-label="With textarea"
            defaultValue=""
            className="measureTitle centerAlign cells"
          />
        </td>
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
              <th key="Score" className="measureTitle centerAlign borderedCell">
                Score
              </th>
            </tr>
          </thead>
          <tbody>{dataRow}</tbody>
        </Table>
      </div>
    );
  }
}

class ViewRubric extends Component {
  componentDidMount() {
    if (this.props.match.params.rubricId) {
      this.props.getSingleRubric(this.props.match.params.rubricId);
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
        displayRubric = <AnalyseRubric key={rubric.Rubric_ID} {...rubric} />;
      } else {
        displayRubric = <h2>Rubric not found!</h2>;
      }
    }
    return <div>{displayRubric}</div>;
  }
}

// export default ViewRubric;
ViewRubric.propTypes = {
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
  { getSingleRubric, setMeasureValue, setDataValue }
)(ViewRubric);
