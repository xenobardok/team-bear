import React from "react";

export default function ScoreStudent(props) {
  return (
    <>
      {props.data.map(value => (
        <tr>
          <td>{value.Student_Name}</td>
          <td>{value.Student_ID}</td>
          <td>{value.Score}</td>
        </tr>
      ))}
    </>
  );
}
