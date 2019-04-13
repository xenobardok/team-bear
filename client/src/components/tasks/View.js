import React, { Component } from "react";
// import Spinner from "../../common/Spinner";
import { Switch, Route } from "react-router";
import ViewRubric from "../tasks/ViewRubric";
import ViewTests from "../tasks/ViewTests";

class ViewTask extends Component {
  render() {
    return (
      <Switch>
        {/* {this.props.Measure_Type === "rubric"? 
        <Route exact path=""></Route>    
    } */}
      </Switch>
    );
  }
}
export default ViewTask;
