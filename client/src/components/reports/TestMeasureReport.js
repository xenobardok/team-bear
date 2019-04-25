import React, { Component } from "react";
import { connect } from "react-redux";
import { generateMeasureReport } from "../../actions/reportsActions";
import { Table, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import RubricStudent from "./RubricStudent";
import ScoreStudent from "./ScoreStudents";

class TestReport extends Component {
  componentDidMount() {
    this.props.generateMeasureReport(this.props.match.params.id);
  }
  render() {
    let { report, loading } = this.props.reports;
    let tableContent = null;
    let title = null;
    if (loading || isEmpty(report)) {
      tableContent = <Spinner />;
    } else {
      title = <h4 className="text-center">{report.Measure_Label}</h4>;
      if (report.Test_Type === "score") {
        tableContent = (
          <Table striped bordered hover className="text-center report score">
            <thead className="">
              <tr>
                <td>Student Name</td>
                <td>Student ID</td>
                <td>Score</td>
              </tr>
            </thead>
            <tbody>
              <ScoreStudent data={report.data} />
              <tr>
                <td colSpan="2">Total</td>
                <td>{report.data.length}</td>
              </tr>
              <tr>
                <td colSpan="2">Number greater than {report.Target}</td>
                <td>coming soon</td>
              </tr>
              <tr>
                <td colSpan="2">Percentage greater than {report.Target}</td>
                <td>{report.Achieved_Threshold}</td>
              </tr>
            </tbody>
          </Table>
        );
      } else if (report.Test_Type === "pass/fail") {
        tableContent = (
          <Table striped bordered hover className="text-center report score">
            <thead className="">
              <tr>
                <td>Student Name</td>
                <td>Student ID</td>
                <td>Score</td>
              </tr>
            </thead>
            <tbody>
              <ScoreStudent data={report.data} />
              <tr>
                <td colSpan="2">Total</td>
                <td>{report.data.length}</td>
              </tr>
              <tr>
                <td colSpan="2">Number greater than {report.Target}</td>
                <td>coming soon</td>
              </tr>
              <tr>
                <td colSpan="2">Percentage greater than {report.Target}</td>
                <td>{Math.round(report.Achieved_Threshold * 100) / 100}</td>
              </tr>
            </tbody>
          </Table>
        );
      }
    }
    return (
      <Container className="single-measure">
        {title}
        <br />
        {tableContent}
      </Container>
    );
  }
}
TestReport.propTypes = {
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
)(TestReport);
