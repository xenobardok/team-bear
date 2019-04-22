import React from "react";
import { Dropdown, DropdownButton, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
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
      <a href="" onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
}

export default function ThreeDotDropdown(props) {
  return (
    <Dropdown className="dropdown three-dots" alignRight>
      <Dropdown.Toggle id="dropdown-custom-components" as={CustomToggle}>
        <FontAwesomeIcon icon="ellipsis-v" />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Link
          to={"/dashboard/reports/measure/" + props.Measure_ID}
          className="dropdown-item"
        >
          Edit Program
        </Link>
      </Dropdown.Menu>
    </Dropdown>
  );
}
