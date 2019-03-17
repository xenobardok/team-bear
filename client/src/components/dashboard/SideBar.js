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
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

library.add(faBars, faTimes, faHome, faTasks, faFileAlt, faEnvelope);

class SideBar extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Menu
        width={"250px"}
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        noOverlay
        isOpen
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
        <Link className="menu-item" to="/inbox">
          <FontAwesomeIcon icon="envelope" />
          &nbsp;&nbsp;Inbox [NW]
        </Link>
        <Link className="menu-item" to="/reports">
          <FontAwesomeIcon icon="file-alt" />
          &nbsp;&nbsp;Reports [NW]
        </Link>
        <hr className="label" />
        <Link to="/dashboard/rubrics">Rubrics</Link>
      </Menu>
    );
  }
}

export default SideBar;
