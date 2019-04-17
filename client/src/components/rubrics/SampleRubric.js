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
        if (j == 0) {
          children.push(
            <td className="borderedCell text-center measureTitle" key={i + j}>
              Criteria #{i + 1}
            </td>
          );
        } else {
          children.push(
            <td className="borderedCell text-center" key={i + j}>
              SAMPLE
            </td>
          );
        }
      }
      if (props.weighted === "true") {
        children.push(
          <td className="borderedCell grade text-center" key={i + 5}>
            20
          </td>
        );
      }
      //Create the parent and add the children
      table.push(<tr key={i + 25}>{children}</tr>);
    }

    return table;
  };

  return (
    <Table bordered hover className="sample-table">
      <thead>
        <tr className="header text-center">
          <th className="borderedCell text-center">Criteria</th>
          {props.Scale.map(scale => (
            <th className="borderedCell text-center" key={Number(scale.value)}>
              {scale.label ? scale.label : scale.value}
            </th>
          ))}
          {props.weighted === "true" ? (
            <th className="borderedCell text-center">Weight(100)</th>
          ) : null}
        </tr>
      </thead>
      <tbody>{createTable()}</tbody>
    </Table>
  );
}
