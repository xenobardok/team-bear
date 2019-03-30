import React, { Component } from "react";
import isEmpty from "../../validation/isEmpty";
import { Form, Row, Col } from "react-bootstrap";
import { getEvaluators } from "../../actions/profileActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheck } from "@fortawesome/free-solid-svg-icons";
library.add(faTimesCircle, faCheck);

class EvaluatorBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Evaluator: ""
    };
  }
  addEvaluator = () => {
    this.props.addButtonEvaluator(this.state.Evaluator);
  };
  render() {
    let { Evaluator_Name, Evaluator_Email } = this.props;
    let content = "";
    if (!isEmpty(this.props.Evaluator_Name)) {
      content = (
        <>
          <FontAwesomeIcon icon="times-circle" className="crossIcon" />
          <div style={{ paddingRight: "30px" }}>
            <div>{Evaluator_Name}</div>
            <div>{Evaluator_Email}</div>
          </div>
        </>
      );
    } else {
      content = (
        <>
          <Form onSubmit={this.addEvaluator}>
            <FontAwesomeIcon
              icon="times-circle"
              className="crossIcon"
              onClick={this.props.addEvaluator}
            />
            <FontAwesomeIcon
              icon="check"
              className="checkIcon"
              onClick={this.addEvaluator}
            />
            <div style={{ paddingRight: "30px" }}>
              <Form.Group
                controlId="formBasicEmail"
                style={{ margin: "0px 0px 0px 10px" }}
              >
                <Form.Label>Select Evaluator:</Form.Label>
                <Form.Control
                  name="Evaluator"
                  as="select"
                  value={this.state.Evaluator}
                  onChange={e =>
                    this.setState({ [e.target.name]: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Choose one:
                  </option>
                  {!isEmpty(this.props.values) ? (
                    this.props.values.map((item, index) => (
                      <option value={item.Email}>
                        {item.Name}
                        {" ("}
                        {item.Email}
                        {")"}
                      </option>
                    ))
                  ) : (
                    <option value="">No Evaluators yet</option>
                  )}
                </Form.Control>
              </Form.Group>
            </div>
          </Form>
        </>
      );
    }
    return <div className="singleEvaluator">{content}</div>;
  }
}

export default EvaluatorBox;
