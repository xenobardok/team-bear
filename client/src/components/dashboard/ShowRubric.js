import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSingleRubric } from "../../actions/rubricsActions";
import { Table, FormControl } from "react-bootstrap";
import Spinner from "../../common/Spinner";
// import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

let scalesRow, dataRow;

class AnalyseRubric extends Component {
  onChangeMeasure = event => {
    this.props.anyfunction(event.target.name, event.target.value);
  };
  onChangeDataValue = event => {
    this.props.anyfunction(event.target.name, event.target.value);
  };
  render() {
    scalesRow = this.props.Scale.map(singleValue => (
      <th>{singleValue.label}</th>
    ));

    dataRow = this.props.data.map(singleRow => (
      <tr>
        <td>
          <FormControl
            name={singleRow.Rubric_Row_ID}
            as="textarea"
            aria-label="With textarea"
            onChange={this.onChangeMeasure.bind(this)}
            defaultValue={singleRow.Measure_Factor}
          />
        </td>
        {singleRow.Column_values.map(cell => {
          return (
            <td>
              <FormControl
                name={cell.Column_ID}
                as="textarea"
                aria-label="With textarea"
                onChange={this.onChangeDataValue.bind(this)}
                defaultValue={cell.value}
              />
            </td>
          );
        })}
      </tr>
    ));
    return (
      <div>
        <h2>{this.props.Rubric_Name}</h2>
        <Table bordered striped>
          <thead>
            <tr>
              <th>Criteria</th>
              {scalesRow}
            </tr>
          </thead>
          <tbody>{dataRow}</tbody>
        </Table>
      </div>
    );
  }
}

class ShowRubric extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getSingleRubric(this.props.match.params.id);
      console.log(this.props.rubrics);
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
        displayRubric = <AnalyseRubric {...rubric} />;
      } else {
        displayRubric = <h2>Rubric not found!</h2>;
      }
    }
    return <div>{displayRubric}</div>;
  }
}

// export default ShowRubric;
ShowRubric.propTypes = {
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
  { getSingleRubric }
)(ShowRubric);
