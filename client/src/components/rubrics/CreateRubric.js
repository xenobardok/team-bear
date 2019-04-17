import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createRubric } from "../../actions/rubricsActions";
import { Form, Col, Button, Row } from "react-bootstrap";
import classnames from "classnames";
import SampleRubric from "./SampleRubric";

class Scales extends Component {
  changeHandler(e) {
    if (typeof this.props.onChange === "function") {
      this.props.onChange(e.target.name, e.target.value);
    }
  }
  render() {
    return (
      <div key={this.props.no}>
        <Row>
          <Col>
            <Form.Control
              name={this.props.name + ".label"}
              placeholder="Letter"
              value={this.props.value.label}
              onChange={this.changeHandler.bind(this)}
              required
            />
          </Col>
          <Col>
            <Form.Control
              placeholder="Grade weight"
              name={this.props.name + ".value"}
              value={this.props.value.value}
              onChange={this.changeHandler.bind(this)}
              disabled
            />
          </Col>
        </Row>
        <br />
      </div>
    );
  }
}

class CreateRubric extends Component {
  constructor() {
    super();
    this.state = {
      Rubric_Name: "",
      Rows_Num: "5",
      Column_Num: "3",
      Scale: [
        {
          label: "",
          value: 1
        },
        {
          label: "",
          value: 2
        }
      ],
      errors: {},
      weighted: "false"
      // rubric: {}
    };
  }
  componentDidMount() {
    // this.props.getRubrics();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.rubric) {
      console.log(nextProps.rubric);
      this.props.history.push(
        "/dashboard/rubrics/" + nextProps.rubric.Rubric_ID
      );
    }

    if (nextProps.errors) {
      // console.log(nextProps.errors);
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name === "Column_Num") {
      console.log("Changing array limit");
      const scaleArray = [];
      for (var i = 0; i < e.target.value - 1; i++) {
        scaleArray.push({
          label: "",
          value: i + 1
        });
      }
      this.setState({
        Scale: scaleArray
      });
    }
  }

  handleOptionChange = e => {
    this.setState({
      weighted: e.target.value
    });
  };

  onScaleChange(index, value) {
    // console.log(index);
    // console.log(value);
    this.setState(state => {
      const Scale = state.Scale.map((v, i) => {
        if (index === "Scale[" + i + "].label") {
          return {
            label: value,
            value: v.value
          };
        } else if (index === "Scale[" + i + "].value") {
          return {
            label: v.label,
            value: value
          };
        } else {
          return {
            label: v.label,
            value: v.value
          };
        }
      });

      return {
        ...state,
        Scale
      };
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const rubric = {
      Rubric_Name: this.state.Rubric_Name,
      Rows_Num: this.state.Rows_Num,
      Column_Num: this.state.Column_Num,
      Scale: this.state.Scale,
      isWeighted: this.state.weighted
    };
    console.log(rubric);
    this.props.createRubric(rubric);
  }
  render() {
    let scaleRows = [];
    for (var i = 0; i < this.state.Column_Num - 1; i++) {
      scaleRows.push(
        <Scales
          name={"Scale[" + i + "]"}
          no={i}
          key={i}
          value={this.state.Scale[i]}
          onChange={this.onScaleChange.bind(this)}
        />
      );
    }
    const { errors } = this.state;
    return (
      <>
        <Form onSubmit={this.onSubmit.bind(this)} className="createRubric">
          <h2>Create a new Rubric</h2>
          <br />
          <Form.Group as={Row} controlId="formHorizontalRubric">
            <Form.Label column sm={4}>
              Name of the Rubric:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                name="Rubric_Name"
                type="text"
                placeholder="Eg. BUSN 3005 Presentation Rubric"
                value={this.state.Rubric_Name}
                onChange={this.onChange.bind(this)}
                className={classnames("", { "is-invalid": errors.Rubric_Name })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.Rubric_Name}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="weightedRubric">
            <Form.Label column sm={4}>
              Is this a weighted rubric?
            </Form.Label>
            <Col sm={8}>
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="customRadio1"
                  name="weighted"
                  className="custom-control-input"
                  value="true"
                  checked={this.state.weighted === "true"}
                  onChange={this.handleOptionChange}
                />
                <label className="custom-control-label" htmlFor="customRadio1">
                  Yes
                </label>
              </div>
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="customRadio2"
                  name="weighted"
                  className="custom-control-input"
                  value="false"
                  checked={this.state.weighted === "false"}
                  onChange={this.handleOptionChange}
                />
                <label className="custom-control-label" htmlFor="customRadio2">
                  No
                </label>
              </div>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalRows">
            <Form.Label column sm={4}>
              No. of Rows:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                as="select"
                name="Rows_Num"
                value={this.state.Rows_Num}
                onChange={this.onChange.bind(this)}
              >
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalCols">
            <Form.Label column sm={4}>
              No. of Columns:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                as="select"
                name="Column_Num"
                value={this.state.Column_Num}
                onChange={this.onChange.bind(this)}
              >
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalScales">
            <Form.Label column sm={4}>
              Define Scales:
            </Form.Label>
            <Col sm={8}>{scaleRows}</Col>
          </Form.Group>
          <Button
            variant="primary"
            block
            onClick={this.onSubmit.bind(this)}
            type="submit"
          >
            Create
          </Button>
        </Form>
        {this.state.Rubric_Name === "" ? (
          <h3 className="text-center">Sample</h3>
        ) : (
          <h3 className="text-center">{this.state.Rubric_Name}</h3>
        )}
        <SampleRubric {...this.state} />
        <p />
      </>
    );
  }
}

CreateRubric.propTypes = {
  auth: PropTypes.object.isRequired
  // rubric: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  rubric: state.rubrics.rubric
});

export default connect(
  mapStateToProps,
  { createRubric }
)(CreateRubric);
