import React, { Component } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getEvaluators } from "../../actions/profileActions";
import isEmpty from "../../validation/isEmpty";
import Spinner from "../../common/Spinner";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import AddEvaluator from "./AddEvaluator";
library.add(faUserPlus);
class Evaluators extends Component {
  constructor() {
    super();
    this.state = {
      modalShow: false
    };
  }

  componentDidMount() {
    this.props.getEvaluators();
  }
  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let { evaluators, loading } = this.props.profile;
    let evaluatorsList;
    if (loading || isEmpty(evaluators)) {
      evaluatorsList = <Spinner />;
    } else {
      evaluatorsList = evaluators.map(value => (
        <>
          {value.isActive === "true" ? (
            <ListGroup.Item key={value.Email}>{value.Name}</ListGroup.Item>
          ) : (
            <ListGroup.Item key={value.Email}>
              {value.Email}
              <div style={{ float: "right" }}>
                <Badge variant="warning">
                  <span style={{ fontWeight: "400" }}>Pending</span>
                </Badge>
                &nbsp;&nbsp;
                <Badge variant="danger" style={{ cursor: "pointer" }}>
                  <span style={{ fontWeight: "400" }}>Cancel Invite</span>
                </Badge>
              </div>
            </ListGroup.Item>
          )}
        </>
      ));
    }
    return (
      <>
        <Card className="text-center">
          <Card.Header>List of Evaluators</Card.Header>
          <Card.Body style={{ padding: "0px" }}>
            <ListGroup variant="flush">{evaluatorsList}</ListGroup>
          </Card.Body>
          <Card.Footer
            onClick={() => this.setState({ modalShow: true })}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon="user-plus" />
            &nbsp;&nbsp;Invite an Evaluator
          </Card.Footer>
        </Card>
        <AddEvaluator show={this.state.modalShow} onHide={modalClose} />
      </>
    );
  }
}

Evaluators.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getEvaluators: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getEvaluators }
)(Evaluators);
