import React, { Component } from "react";
import {
  Card,
  ListGroup,
  Badge,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getEvaluators,
  addEvaluator,
  cancelInvite,
  removeEvaluator
} from "../../actions/profileActions";
import isEmpty from "../../validation/isEmpty";
import Spinner from "../../common/Spinner";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import AddEvaluator from "./AddEvaluator";
import ThreeDot from "./ThreeDot";
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
      evaluatorsList = evaluators.map((value, index) => (
        <ListGroup variant="flush" key={value.Email} className="edit-post">
          {value.isActive === "true" ? (
            <>
              <ListGroup.Item key={value.Email} style={{ flexGrow: "1" }}>
                {value.Name}
              </ListGroup.Item>
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <div
                  style={{
                    display: "flex",
                    alignSelf: "center",
                    cursor: "pointer"
                  }}
                >
                  {/* <ThreeDot editHandler={this.editHandler} type="Cycle" /> */}
                  <ThreeDot
                    type="active"
                    removeEvaluator={this.props.removeEvaluator}
                    email={value.Email}
                  />
                  {/* <FontAwesomeIcon icon="edit" className="edit" /> */}
                </div>
              </OverlayTrigger>
            </>
          ) : (
            <>
              <ListGroup.Item style={{ flexGrow: "1" }}>
                {value.Email}
                <div style={{ float: "right" }}>
                  <Badge variant="warning">
                    <span style={{ fontWeight: "400" }}>Pending</span>
                  </Badge>
                </div>
              </ListGroup.Item>
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <div
                  style={{
                    display: "flex",
                    alignSelf: "center",
                    cursor: "pointer"
                  }}
                >
                  {/* <ThreeDot editHandler={this.editHandler} type="Cycle" /> */}
                  <ThreeDot
                    type="invite"
                    cancelInvite={this.props.cancelInvite}
                    email={value.Email}
                  />
                  {/* <FontAwesomeIcon icon="edit" className="edit" /> */}
                </div>
              </OverlayTrigger>
            </>
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
  { getEvaluators, addEvaluator, cancelInvite, removeEvaluator }
)(Evaluators);
