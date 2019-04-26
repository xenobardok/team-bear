import React, { Component } from "react";
import { connect } from "react-redux";
import { generateOutcomeReport } from "../../actions/reportsActions";
import { Table, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";

class OutcomeReport extends Component {
  componentDidMount() {
    this.props.generateOutcomeReport(this.props.match.params.id);
  }
  classAvg = () => {};
  render() {
    let { report, loading } = this.props.reports;
    let reportContent;
    if (loading || isEmpty(report)) {
      reportContent = <Spinner />;
    } else {
      reportContent = (
        <>
          <h3 className="text-center font-weight-bold">
            Outcome {report.Outcome_Index}
          </h3>
          <h5 className="text-center">{report.Outcome_Name}</h5>
          <br />
          <h3 className="font-weight-bold">Evaluations Instruments:</h3>
          <h5 />
          <br />
          <h3 className="font-weight-bold">Measures of Performance:</h3>
          {report.Measures.map(measure => (
            <div style={{ maxWidth: "600px" }} className="mx-auto">
              <h5>{measure.Measure_Name}</h5>
              <h6 className="text-center font-weight-bold font-weight-bold font-italic">
                {measure.Measure_Result}
              </h6>
              <br />
            </div>
          ))}
        </>
      );
    }
    return <Container className="single-measure">{reportContent}</Container>;
  }
}

OutcomeReport.propTypes = {
  generateOutcomeReport: PropTypes.func.isRequired,
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
  { generateOutcomeReport }
)(OutcomeReport);
