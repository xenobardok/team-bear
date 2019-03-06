import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createRubric } from "../../actions/rubricsActions";
import { Form, Col, Button, Row } from "react-bootstrap";
import classnames from "classnames";

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
              required
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
      Column_Num: "2",
      Scale: [
        {
          label: "",
          value: ""
        }
      ],
      errors: {}
    };
  }
  componentDidMount() {
    // this.props.getRubrics();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rubric) {
      console.log(nextProps.rubric);
      this.props.history.push("/rubrics");
    }

    if (nextProps.errors) {
      console.log(nextProps.errors);
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
          value: ""
        });
      }
      this.setState({
        Scale: scaleArray
      });
    }
  }

  onScaleChange(index, value) {
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

      // console.log(value);
      // console.log(Scale);
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
      Scale: this.state.Scale
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
      <Form onSubmit={this.onSubmit.bind(this)}>
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
  rubric: state.rubric
});

export default connect(
  mapStateToProps,
  { createRubric }
)(CreateRubric);
