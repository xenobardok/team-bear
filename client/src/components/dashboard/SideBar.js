import React, { Component } from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faHome,
  faTasks,
  faFileAlt,
  faEnvelope,
  faCircleNotch,
  faTable,
  faUsers,
  faUserCog,
  faQuestionCircle,
  faBook
} from "@fortawesome/free-solid-svg-icons";
import UserManualAll from "./Capstone-User-Manual-All-Users.pdf";
import UserManualEvaluator from "./USER MANUAL- Evaluator.pdf";
library.add(
  faBars,
  faTimes,
  faHome,
  faTasks,
  faFileAlt,
  faEnvelope,
  faCircleNotch,
  faTable,
  faUsers,
  faUserCog,
  faQuestionCircle,
  faBook
);

class SideBar extends Component {
  constructor() {
    super();
    this.state = { editMode: false };
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle() {
    this.setState({ editMode: !this.state.editMode });
  }

  render() {
    let links;
    if (this.props.auth.user.type === "Admin") {
      links = (
        <Menu
          width={"250px"}
          pageWrapId={"page-wrap"}
          outerContainerId={"outer-container"}
          noOverlay
          // isOpen
          customBurgerIcon={<FontAwesomeIcon icon="bars" />}
          customCrossIcon={<FontAwesomeIcon icon="times" color="white" />}
        >
          <br />
          <h2 className="label">
            <span>ULM</span> Evaluations
          </h2>
          <Link className="menu-item" to="/dashboard">
            <FontAwesomeIcon icon="home" />
            &nbsp;&nbsp;Home
          </Link>
          {this.props.auth.user.isSuperUser === "true" ? (
            <Link className="menu-item" to="/dashboard/programs">
              <FontAwesomeIcon icon="user-cog" />
              &nbsp;&nbsp;Admin Tools
            </Link>
          ) : null}
          <Link className="menu-item" to="/dashboard/cycles">
            <FontAwesomeIcon icon="circle-notch" />
            &nbsp;&nbsp;My Cycle
          </Link>

          <Link className="menu-item" to="/dashboard/tasks">
            <FontAwesomeIcon icon="tasks" />
            &nbsp;&nbsp;My Tasks
          </Link>
          <Link className="menu-item" to="/dashboard/logs">
            <FontAwesomeIcon icon="envelope" />
            &nbsp;&nbsp;Notifications
          </Link>
          <Link className="menu-item" to="/dashboard/reports">
            <FontAwesomeIcon icon="file-alt" />
            &nbsp;&nbsp;Reports
          </Link>
          <Link to="/dashboard/rubrics">
            <FontAwesomeIcon icon="table" />
            &nbsp;&nbsp;Rubrics
          </Link>
          <Link to="/dashboard/evaluators">
            <FontAwesomeIcon icon="users" />
            &nbsp;&nbsp;Evaluators
          </Link>
          <Link className="menu-item" to="/dashboard/faqs">
            <FontAwesomeIcon icon="question-circle" />
            &nbsp;&nbsp;FAQs
          </Link>
          <a href={UserManualAll} className="menu-item" target="_blank">
            <FontAwesomeIcon icon="book" />
            &nbsp;&nbsp;User Manual
          </a>
        </Menu>
      );
    } else if (this.props.auth.user.type === "Evaluator") {
      links = (
        <Menu
          width={"250px"}
          pageWrapId={"page-wrap"}
          outerContainerId={"outer-container"}
          noOverlay
          // isOpen
          customBurgerIcon={<FontAwesomeIcon icon="bars" />}
          customCrossIcon={<FontAwesomeIcon icon="times" color="white" />}
        >
          <br />
          <h2 className="label">
            <span>ULM</span> Evaluations
          </h2>
          <Link className="menu-item" to="/dashboard">
            <FontAwesomeIcon icon="home" />
            &nbsp;&nbsp;Home
          </Link>
          <Link className="menu-item" to="/dashboard/tasks">
            <FontAwesomeIcon icon="tasks" />
            &nbsp;&nbsp;My Tasks
          </Link>
          <Link className="menu-item" to="/dashboard/logs">
            <FontAwesomeIcon icon="envelope" />
            &nbsp;&nbsp;Notifications
          </Link>
          <Link className="menu-item" to="/dashboard/faqs">
            <FontAwesomeIcon icon="question-circle" />
            &nbsp;&nbsp;FAQs
          </Link>
          <a href={UserManualEvaluator} className="menu-item" target="_blank">
            <FontAwesomeIcon icon="book" />
            &nbsp;&nbsp;User Manual
          </a>
        </Menu>
      );
    }
    return <>{links}</>;
  }
}

export default SideBar;
