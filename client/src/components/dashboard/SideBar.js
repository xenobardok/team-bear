import React, { Component } from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import {
  faBars,
  faTimes,
  faHome,
  faTasks,
  faFileAlt,
  faEnvelope,
  faCircleNotch,
  faTable,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faBars,
  faTimes,
  faHome,
  faTasks,
  faFileAlt,
  faEnvelope,
  faCircleNotch,
  faTable,
  faUsers
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
    return (
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
        {this.props.auth.user.type === "Admin" ? (
          <Link className="menu-item" to="/dashboard/cycles">
            <FontAwesomeIcon icon="circle-notch" />
            &nbsp;&nbsp;My Cycle
          </Link>
        ) : null}

        <Link className="menu-item" to="/dashboard/tasks">
          <FontAwesomeIcon icon="tasks" />
          &nbsp;&nbsp;My Tasks
        </Link>
        <Link className="menu-item" to="/inbox">
          <FontAwesomeIcon icon="envelope" />
          &nbsp;&nbsp;Inbox [NW]
        </Link>
        <Link className="menu-item" to="/reports">
          <FontAwesomeIcon icon="file-alt" />
          &nbsp;&nbsp;Reports [NW]
        </Link>
        {this.props.auth.user.type === "Admin" ? (
          <Link to="/dashboard/rubrics">
            <FontAwesomeIcon icon="table" />
            &nbsp;&nbsp;Rubrics
          </Link>
        ) : null}
        {this.props.auth.user.type === "Admin" ? (
          <Link to="/dashboard/evaluators">
            <FontAwesomeIcon icon="users" />
            &nbsp;&nbsp;Evaluators
          </Link>
        ) : null}
        {/* {this.props.auth.user.type === "Admin" ? (
          <div className="label" style={{ display: "flex" }}>
            <div style={{ display: "inline" }}>
              <p style={{ display: "inline" }}>Edit mode: &nbsp;&nbsp;</p>
            </div>
            <Toggle
              defaultChecked={this.state.editMode}
              onChange={this.onToggle}
            />
          </div>
        ) : null} */}
      </Menu>
    );
  }
}

export default SideBar;
