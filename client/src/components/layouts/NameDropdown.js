import React from "react";
import { Dropdown, DropdownButton, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
library.add(faEllipsisV);

class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    this.props.onClick(e);
  }

  render() {
    return (
      <a href="" onClick={this.handleClick} className="navbar-name">
        {this.props.children}
      </a>
    );
  }
}

export default function NameDropdown(props) {
  return (
    <Dropdown className="dropdown three-dots" alignRight>
      <Dropdown.Toggle id="dropdown-custom-components" as={CustomToggle}>
        {/* <FontAwesomeIcon icon="ellipsis-v" /> */}
        <span>
          {props.firstname} {props.lastname}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={props.showModal}>Edit Profile</Dropdown.Item>
        <Dropdown.Item onClick={props.logoutUser}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
