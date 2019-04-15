import React from "react";

export default function Students(props) {
  let avgScoreColSpan = 0;
  return (
    <>
      {/* <td rowSpan="5">{props.Class_Name}</td> */}
      {props.data.map(value => (
        <>
          {value.data.map((newValue, index) => (
            <tr>
              <td>{value.Student_Name}</td>

              {newValue.map((item, newIndex) => (
                <td>
                  {typeof item === "number" && { item } % 1 !== 0 ? (
                    <>{Math.round(item * 100) / 100}</>
                  ) : (
                    item
                  )}
                </td>
              ))}
              <td>{Math.round(value.Average_Score * 100) / 100}</td>
            </tr>
          ))}
        </>
      ))}
    </>
  );
}
