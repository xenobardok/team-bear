import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function EditableProgramList(props) {
  return (
    <Link to={`/dashboard/programs/${props.Department_ID}`}>
      <ListGroup.Item>
        <span width="100px">{props.Dept_ID}</span>: {props.Dept_Name}
      </ListGroup.Item>
    </Link>
  );
}
