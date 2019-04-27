import React, { Component } from "react";
import { connect } from "react-redux";
import { generateCycleReport } from "../../actions/reportsActions";
import { Table } from "react-bootstrap";
import PropTypes from "prop-types";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

class CycleReport extends Component {
  componentDidMount() {
    this.props.generateCycleReport(this.props.match.params.id);
  }
  classAvg = () => {};
  render() {
    let { report, loading } = this.props.reports;
    let tableContent;
    if (loading || isEmpty(report)) {
      tableContent = <Spinner />;
    } else {
      if (!isEmpty(report.Outcomes)) {
        tableContent = (
          <>
            <h3 className="text-center">
              {report.Cycle_Name} - Summary of Results
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="btn btn-primary export-btn"
                table="table-to-xls"
                filename="Report"
                sheet="Report"
                buttonText="Download as Excel File"
              />
            </h3>
            <Table
              striped
              bordered
              hover
              className="text-center report"
              id="table-to-xls"
            >
              <thead>
                <tr>
                  {report.Header.map((head, index) =>
                    index === 0 ? (
                      <th className="measure-name">{head}</th>
                    ) : (
                      <th>{head}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {report.Outcomes.map(outcome => (
                  <>
                    {outcome.Data.map((data, index) => (
                      <tr>
                        {index === 0 ? (
                          <td
                            rowSpan={outcome.Data.length}
                            className="measure-name"
                          >
                            {outcome.Outcome_Name}
                          </td>
                        ) : null}
                        {data.map(singleCol => (
                          <td>{singleCol}</td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </Table>
          </>
        );
      }
    }
    return <>{tableContent}</>;
  }
}

CycleReport.propTypes = {
  generateCycleReport: PropTypes.func.isRequired,
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
  { generateCycleReport }
)(CycleReport);
