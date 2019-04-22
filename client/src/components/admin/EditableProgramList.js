import React from "react";
import { ListGroup } from "react-bootstrap";

export default function EditableProgramList(props) {
  return (
    <>
      <ListGroup.Item>
        <span width="100px">{props.Dept_ID}</span>: {props.Dept_Name}
      </ListGroup.Item>
    </>
  );
}
