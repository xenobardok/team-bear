import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Badge,
  OverlayTrigger,
  Tooltip,
  InputGroup,
  FormControl,
  Form,
  Button,
  Col,
  Row,
  Dropdown,
  DropdownButton,
  Alert
} from "react-bootstrap";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import ThreeDotDropdown from "./ThreeDotDropdown";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import { toastr } from "react-redux-toastr";
library.add();

class Measure extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { loading, program } = this.props.programs;
    let measure;

    if (loading || isEmpty(program)) {
      measure = <Spinner />;
    } else {
      measure = (
        <div>
          <ThreeDotDropdown Measure_ID={this.state.Measure_ID} />
        </div>
      );
    }
    return <Container className="single-measure">{measure}</Container>;
  }
}

Measure.propTypes = {};

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Measure);
