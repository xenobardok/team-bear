import React from "react";
import { Table, FormControl, Button } from "react-bootstrap";

export default function SampleRubric(props) {
  let createTable = () => {
    let table = [];

    // Outer loop to create parent
    for (let i = 0; i < props.Rows_Num; i++) {
      let children = [];
      //Inner loop to create children
      for (let j = 0; j < props.Column_Num; j++) {
        children.push(<td className="borderedCell">SAMPLE</td>);
      }
      //Create the parent and add the children
      table.push(<tr>{children}</tr>);
    }
    return table;
  };
  return (
    <Table striped bordered hover>
      <thead>
        <tr className="header text-center">
          <th>Criteria</th>
        </tr>
      </thead>
      <tbody>{createTable()}</tbody>
    </Table>
  );
}
