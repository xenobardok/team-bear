import React from "react";
import Swal from "sweetalert2";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
library.add(faTrash);

export default function Coordinator(props) {
  let removeCoordinator = () => {
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
        console.log(props.Dept_ID, props.Admin_Email);
        props.removeProgramAdmin(props.Dept_ID, props.Admin_Email);
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  return (
    <>
      <td>
        {props.Admin_Name === " "
          ? "User not registered yet!"
          : props.Admin_Name}
      </td>
      <td>{props.Admin_Email}</td>
      <td className="text-center trash" onClick={removeCoordinator}>
        <FontAwesomeIcon icon="trash" />
      </td>
    </>
  );
}
