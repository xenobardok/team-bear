import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRubrics } from "../../actions/rubricsActions";
import { ListGroup, Card, Button } from "react-bootstrap";
import Spinner from "../../common/Spinner";
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
          <ListGroup.Item action key={value.Rubric_ID}>
            {value.Rubrics_Name}
          </ListGroup.Item>
        ));
      } else {
        rubricsList = (
          <div>
            <br />

            <h4>There is no rubrics to view for you!</h4>
            <Button variant="info" href="/dashboard">
              Return to Dashboard
            </Button>
            <br />
            <br />
          </div>
        );
      }
    }

    if (this.props.auth.user.type === "Admin") {
      createRubric = (
        <Link to="/dashboard/rubrics/create">
          <Button variant="primary">Create a new rubric</Button>
        </Link>
      );
    }
    return (
      <Card className="text-center">
        <Card.Header>List of Available Rubrics</Card.Header>
        <Card.Body>
          {rubricsList}
          <br />
          {createRubric}
        </Card.Body>
        {/* {rubrics.map(item => (
          <DisplayRubric name={item.Rubrics_Name} />
        ))} */}
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
  { getRubrics }
)(Rubrics);
