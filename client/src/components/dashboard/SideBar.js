import React, { Component } from "react";
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
  constructor(props) {
    super(props);
  }

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
        <a className="menu-item" href="/">
          <FontAwesomeIcon icon="home" />
          &nbsp;&nbsp;Home
        </a>
        <a className="menu-item" href="/tasks">
          <FontAwesomeIcon icon="tasks" />
          &nbsp;&nbsp;My Tasks
        </a>
        <a className="menu-item" href="/inbox">
          <FontAwesomeIcon icon="envelope" />
          &nbsp;&nbsp;Inbox
        </a>
        <a className="menu-item" href="/reports">
          <FontAwesomeIcon icon="file-alt" />
          &nbsp;&nbsp;Reports
        </a>
        <br />
        <br />
        <br />
      </Menu>
    );
  }
}

export default SideBar;
