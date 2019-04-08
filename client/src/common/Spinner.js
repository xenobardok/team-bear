import React from "react";
import spinner from "./spinner.gif";
import "./spinner.css";

// export default function Spinner() {
//   return (
//     <div>
//       <img
//         src={spinner}
//         style={{ width: "100px", margin: "auto", display: "block" }}
//         alt="Loading..."
//       />
//     </div>
//   );
// }

export default function Spinner() {
  return (
    <div style={{ padding: "50px" }}>
      <div
        style={{ margin: "auto", color: "#7b344a" }}
        className="la-ball-spin-clockwise"
      >
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
