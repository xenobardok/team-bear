import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

export default function Department(props) {
  const [Dept_ID, changeDeptID] = useState(props.Dept_ID);
  const [Dept_Name, changeDeptName] = useState(props.Dept_Name);

  let saveButtonDeptID = () => {
    props.updateProgramID(props.Department_ID, Dept_ID);
    props.toggleDepartmentIDEdit();
  };
  let saveButtonDeptName = () => {
    props.updateProgramName(props.Department_ID, Dept_Name);
    props.toggleDepartmentNameEdit();
  };
  let cancelButtonDeptID = () => {
    changeDeptID(props.Dept_ID);
    props.toggleDepartmentIDEdit();
  };

  let cancelButtonDeptName = () => {
    changeDeptName(props.Dept_Name);
    props.toggleDepartmentNameEdit();
  };
  return (
    <section className="department">
      <h4>
        Department ID:{" "}
        {!props.editID ? (
          <>{Dept_ID}</>
        ) : (
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Dept"
              value={Dept_ID}
              onChange={e => changeDeptID(e.target.value)}
            />
            <InputGroup.Append>
              <Button variant="primary" onClick={saveButtonDeptID}>
                Save Changes
              </Button>
            </InputGroup.Append>
            <InputGroup.Append>
              <Button variant="secondary" onClick={cancelButtonDeptID}>
                Cancel
              </Button>
            </InputGroup.Append>
          </InputGroup>
        )}
      </h4>
      <h4>
        Department Name:{" "}
        {!props.editName ? (
          <>{Dept_Name}</>
        ) : (
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Dept"
              value={Dept_Name}
              onChange={e => changeDeptName(e.target.value)}
            />
            <InputGroup.Append>
              <Button variant="primary" onClick={saveButtonDeptName}>
                Save Changes
              </Button>
            </InputGroup.Append>
            <InputGroup.Append>
              <Button variant="secondary" onClick={cancelButtonDeptName}>
                Cancel
              </Button>
            </InputGroup.Append>
          </InputGroup>
        )}
      </h4>
    </section>
  );
}
