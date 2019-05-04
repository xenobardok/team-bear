import React, { Component } from "react";
import { Container, Jumbotron, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getLogs } from "../../actions/logsActions";
import "../../App.css";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import { Link } from "react-router-dom";
class ViewLogs extends Component {
  componentDidMount() {
    this.props.getLogs();
  }

  render() {
    let { logs, loading } = this.props.logs;
    let logsFilter,
      viewMore = null;
    if (loading) {
      logsFilter = <Spinner />;
    } else if (isEmpty(logs)) {
      logsFilter = (
        <p className="text-center">
          There are no logs for you to view at this time
        </p>
      );
    } else {
      if (this.props.from === "dashboard") {
        let logSize = 5;
        logsFilter = logs
          .slice(0, logSize)
          .map((log, index) => <LogView {...log} key={log.Time + index} />);
        viewMore = (
          <Link to="/dashboard/logs">
            <div className="log text-center logs-link">
              View all 50 latest logs
            </div>
          </Link>
        );
      } else {
        let logSize = 50;
        logsFilter = logs
          .slice(0, logSize)
          .map((log, index) => <LogView {...log} key={log.Time + index} />);
      }
    }

    return (
      <Jumbotron fluid>
        <Container>
          <h5>Recent Activity Log</h5>
          <div>{logsFilter}</div>
          {viewMore}
        </Container>
      </Jumbotron>
    );
  }
}

const LogView = props => {
  return (
    <div className="log">
      <Row>
        <Col xs="3">
          <span className="dateTime">
            {props.Day} {props.Time}
          </span>
        </Col>
        <Col xs="9">{props.Message}</Col>
      </Row>
    </div>
  );
};

ViewLogs.propTypes = {
  auth: PropTypes.object.isRequired,
  logs: PropTypes.object.isRequired,
  getLogs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  logs: state.logs
});

export default connect(
  mapStateToProps,
  { getLogs }
)(ViewLogs);
