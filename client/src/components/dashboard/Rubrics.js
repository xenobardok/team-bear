import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRubrics } from "../../actions/rubricsActions";
import { ListGroup, Card, Button } from "react-bootstrap";
import Spinner from "../../common/Spinner";
// import SideBar from "./SideBar";

const DisplayRubric = props => {
  return (
    <ListGroup defaultActiveKey="#link1">
      <ListGroup.Item action href="#link1">
        {props.name}
      </ListGroup.Item>
    </ListGroup>
  );
};

class Rubrics extends Component {
  componentDidMount() {
    this.props.getRubrics();
  }
  componentWillReceiveProps(nextProps) {
    const rubrics = this.props.rubrics.allRubrics;
    if (rubrics) {
      for (let i = 0; i < rubrics.length; i++) {
        console.log(rubrics[i].Rubrics_Name);
      }
    }
  }
  render() {
    let { allRubrics, loading } = this.props.rubrics;
    let rubricsList;
    if (allRubrics === null || loading) {
      rubricsList = <Spinner />;
    } else {
      // Check if logged in user has rubrics to view
      if (Object.keys(allRubrics).length > 0) {
        rubricsList = "Rubrics coming up";
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

    return (
      <Card className="text-center">
        <Card.Header>List of Available Rubrics</Card.Header>
        <Card.Body>
          <ListGroup.Item action href="#link1">
            {rubricsList}
          </ListGroup.Item>
          <br />
          <Button variant="primary" href="dashboard/rubrics/create">
            Create a new rubric
          </Button>
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
