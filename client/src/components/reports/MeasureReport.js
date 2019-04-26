import React, { Component } from "react";
import { connect } from "react-redux";
import { generateMeasureReport } from "../../actions/reportsActions";
import { Table } from "react-bootstrap";
import PropTypes from "prop-types";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import RubricStudent from "./RubricStudent";

class MeasureReport extends Component {
  componentDidMount() {
    this.props.generateMeasureReport(this.props.match.params.id);
  }
  classAvg = () => {};
  render() {
    let { report, loading } = this.props.reports;
    let tableContent;
    if (loading || isEmpty(report)) {
      tableContent = <Spinner />;
    } else {
      let total = 0;
      let count = 0;
      report.data.map(value => {
        total += value.Average_Score;
        count++;
      });
      let average = Math.round((total / count) * 100) / 100;
      tableContent = (
        <Table striped bordered hover className="text-center report">
          <thead>
            <tr>
              <th colSpan={report.header.length + 2}>{report.Rubric_Name}</th>
            </tr>
            <tr>
              {/* <th>Class</th> */}
              <th>Paper</th>
              {report.header.map(value => (
                <th>{value}</th>
              ))}
              <th>Average Score</th>
            </tr>
          </thead>
          <tbody>
            <RubricStudent data={report.data} Class_Name={report.Class_Name} />
            <tr>
              <td colSpan={report.header.length + 2}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={report.header.length + 1}>Class Avg</td>
              <td>{average ? average : 0}</td>
            </tr>
            <tr>
              <td colSpan={report.header.length + 1}>
                Number >= {report.Target}
              </td>
              <td>{report.Student_Achieved_Target_Count}</td>
            </tr>
            <tr>
              <td colSpan={report.header.length + 1}>
                Number of paper evaluations
              </td>
              <td>{report.Total_Students}</td>
            </tr>
            <tr>
              <td colSpan={report.header.length + 1}>% >= {report.Target}</td>
              <td>{Math.round(report.Achieved_Threshold * 100) / 100}</td>
            </tr>
          </tbody>
        </Table>
      );
    }
    return <>{tableContent}</>;
  }
}

MeasureReport.propTypes = {
  generateMeasureReport: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  reports: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  reports: state.reports
});

export default connect(
  mapStateToProps,
  { generateMeasureReport }
)(MeasureReport);
