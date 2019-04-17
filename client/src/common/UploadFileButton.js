import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./UploadFileButton.css";

export default function UploadFileButton(props) {
  const [label, changeLabel] = useState("Choose a file");
  const [file, changeFile] = useState("");
  let onChangeHandler = e => {
    let labelVal = "Choose a file";
    var fileName = "";
    changeFile(e.target.files[0]);
    fileName = e.target.value.split("\\").pop();
    if (fileName) changeLabel(fileName);
    else changeLabel(labelVal);
  };

  let submitHandler = () => {
    props.fileUploadHandler(file);
    changeLabel("Choose a file");
    changeFile("");
  };

  return (
    <div className="box">
      <input
        type="file"
        name="file"
        id="file"
        className="inputfile"
        onChange={onChangeHandler}
      />
      <label htmlFor="file">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="17"
          viewBox="0 0 20 17"
        >
          <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" />
        </svg>
        {label}
      </label>
      <br />
      <Button type="submit" variant="primary" onClick={submitHandler}>
        Submit
      </Button>
    </div>
  );
}
