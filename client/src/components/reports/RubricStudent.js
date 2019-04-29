import React from "react";
import classnames from "classnames";
export default function RubricStudent(props) {
  return (
    <>
      {/* <td rowSpan="5">{props.Class_Name}</td> */}
      {props.data.map(value => (
        <>
          {value.data.map((newValue, index) => (
            <tr>
              {index === 0 ? (
                <td rowSpan={value.data.length}>{value.Student_Name}</td>
              ) : null}

              {newValue.map((item, newIndex) => (
                <td>
                  {typeof item === "number" && { item } % 1 !== 0 ? (
                    <>{Math.round(item * 100) / 100}</>
                  ) : (
                    item
                  )}
                </td>
              ))}
              {index === 0 ? (
                <td
                  rowSpan={value.data.length}
                  className={classnames("", {
                    "less-than-target": value.Average_Score < props.Target
                  })}
                >
                  {Math.round(value.Average_Score * 100) / 100}
                </td>
              ) : null}
            </tr>
          ))}
        </>
      ))}
    </>
  );
}
