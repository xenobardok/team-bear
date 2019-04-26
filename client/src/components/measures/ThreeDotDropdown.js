import React from "react";
import { Dropdown } from "react-bootstrap";
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
        {props.type === "rubric" ? (
          <Link
            to={"/dashboard/reports/rubricMeasure/" + props.Measure_ID}
            className="dropdown-item"
          >
            Generate Report
          </Link>
        ) : null}
        {props.type === "test" ? (
          <Link
            to={"/dashboard/reports/testMeasure/" + props.Measure_ID}
            className="dropdown-item"
          >
            Generate Report
          </Link>
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
