import React, { Component } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getEvaluators,
  addEvaluator,
  removeEvaluator
} from "../../actions/profileActions";
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
  removeEvaluator = removeEmail => {
    console.log(removeEmail);
    this.props.removeEvaluator(removeEmail);
  };
  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let { evaluators, loading } = this.props.profile;
    let evaluatorsList;
    if (loading || isEmpty(evaluators)) {
      evaluatorsList = <Spinner />;
    } else {
      evaluatorsList = evaluators.map((value, index) => (
        <ListGroup variant="flush" key={value.Email}>
          {value.isActive === "true" ? (
            <ListGroup.Item key={value.Email}>{value.Name}</ListGroup.Item>
          ) : (
            <ListGroup.Item>
              {value.Email}
              <div style={{ float: "right" }}>
                <Badge variant="warning">
                  <span style={{ fontWeight: "400" }}>Pending</span>
                </Badge>
                &nbsp;&nbsp;
                <Badge variant="danger" style={{ cursor: "pointer" }}>
                  <span
                    style={{ fontWeight: "400" }}
                    onClick={this.removeEvaluator.bind(this, value.Email)}
                  >
                    Cancel Invite
                  </span>
                </Badge>
              </div>
            </ListGroup.Item>
          )}
        </ListGroup>
      ));
    }
    return (
      <>
        <Card className="text-center">
          <Card.Header>List of Evaluators</Card.Header>
          <Card.Body style={{ padding: "0px" }}>{evaluatorsList}</Card.Body>
          <Card.Footer
            onClick={() => this.setState({ modalShow: true })}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon="user-plus" />
            &nbsp;&nbsp;Invite an Evaluator
          </Card.Footer>
        </Card>
        <AddEvaluator
          show={this.state.modalShow}
          onHide={modalClose}
          addEvaluator={this.props.addEvaluator}
        />
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
  { getEvaluators, addEvaluator, removeEvaluator }
)(Evaluators);
