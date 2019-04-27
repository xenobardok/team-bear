import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRubrics, deleteRubric } from "../../actions/rubricsActions";
import { ListGroup, Card, Button } from "react-bootstrap";
import Spinner from "../../common/Spinner";
import EditableRubricList from "./EditableRubricList";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus);
// import SideBar from "./SideBar";

class Rubrics extends Component {
  componentDidMount() {
    this.props.getRubrics();
  }

  render() {
    let { allRubrics, loading } = this.props.rubrics;
    let rubricsList = "";
    let createRubric;
    if (allRubrics === null || loading) {
      rubricsList = <Spinner />;
    } else {
      // Check if logged in user has rubrics to view
      if (Object.keys(allRubrics).length > 0) {
        rubricsList = allRubrics.map(value => (
          <EditableRubricList
            key={value.Rubric_ID}
            {...value}
            deleteRubric={this.props.deleteRubric}
          />
          // <Link
          //   key={value.Rubric_ID}
          //   to={"/dashboard/rubrics/" + value.Rubric_ID}
          // >
          //   <ListGroup.Item action key={value.Rubric_ID}>
          //     {value.Rubrics_Name}
          //   </ListGroup.Item>
          // </Link>
        ));
      } else {
        rubricsList = (
          <div>
            <br />

            <h5>There are no rubrics to view for you!</h5>
            <Link to="/dashboard">
              <Button variant="primary">Return to Dashboard</Button>
            </Link>
            <br />
            <br />
          </div>
        );
      }
    }

    if (this.props.auth.user.type === "Admin") {
      createRubric = <Link to="/dashboard/rubrics/create" />;
    }
    return (
      <Card className="text-center">
        <Card.Header>List of Available Rubrics</Card.Header>
        <Card.Body style={{ padding: "0px" }}>
          <ListGroup variant="flush">{rubricsList}</ListGroup>
        </Card.Body>
        <Card.Footer
          onClick={() => this.props.history.push("/dashboard/rubrics/create")}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon="plus" />
          &nbsp;&nbsp;&nbsp; Create a new rubric
        </Card.Footer>
      </Card>
    );
  }
}

// export default Rubrics;
Rubrics.propTypes = {
  getRubrics: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  rubrics: state.rubrics
});

export default connect(
  mapStateToProps,
  { getRubrics, deleteRubric }
)(Rubrics);
