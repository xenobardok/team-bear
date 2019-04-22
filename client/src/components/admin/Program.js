import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Button, ButtonGroup, Table } from "react-bootstrap";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import ThreeDotDropdown from "./ThreeDotDropdown";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import { toastr } from "react-redux-toastr";
import { getProgram } from "../../actions/programActions";
import Coordinator from "./Coordinator";
library.add();

class Measure extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let { programID } = this.props.match.params;
    console.log(programID);
    this.props.getProgram(programID);
  }
  render() {
    let { loading, program } = this.props.programs;
    let measure;

    if (loading || isEmpty(program)) {
      measure = <Spinner />;
    } else {
      measure = (
        <div>
          <ThreeDotDropdown />
          <section>
            <h4>Department ID: {program.Dept_ID}</h4>
            <h4>Department Name: {program.Dept_Name}</h4>
          </section>
          <br />
          <section>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Program Coordinators:</th>
                </tr>
              </thead>
              <tbody>
                {program.admin.map(admin => (
                  <tr>
                    <Coordinator {...admin} />
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button style={{ marginLeft: "40px" }}>Add a coordinator</Button>
          </section>
        </div>
      );
    }
    return <Container className="single-measure">{measure}</Container>;
  }
}

Measure.propTypes = {};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  programs: state.programs
});

export default connect(
  mapStateToProps,
  { getProgram }
)(Measure);
