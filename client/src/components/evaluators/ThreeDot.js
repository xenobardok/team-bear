import React from "react";
import { Dropdown, DropdownButton, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
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
      <a href="" onClick={this.handleClick} className="edit-cycle">
        {this.props.children}
      </a>
    );
  }
}

export default function ThreeDotCycle(props) {
  let removeEvaluator = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        props.removeEvaluator(props.email);
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  return (
    <Dropdown className="dropdown three-dots" alignRight>
      <Dropdown.Toggle id="dropdown-custom-components" as={CustomToggle}>
        <FontAwesomeIcon icon="ellipsis-v" />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.type === "invite" ? (
          <Dropdown.Item onClick={removeEvaluator}>Cancel Invite</Dropdown.Item>
        ) : (
          <Dropdown.Item>Remove Evaluator</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
