import axios from "axios";
import {
  GET_PROGRAMS,
  GET_ERRORS,
  PROGRAM_LOADING,
  CREATE_PROGRAM,
  GET_SINGLE_PROGRAM,
  ADD_PROGRAM_ADMIN,
  UPDATE_PROGRAM_NAME,
  UPDATE_PROGRAM_ID,
  DELETE_PROGRAM
} from "./types";
import Swal from "sweetalert2";
import { toastr } from "react-redux-toastr";
import { Route, Redirect } from "react-router";
// Get Current Profile

export const getPrograms = () => dispatch => {
  dispatch(setProgramLoading());
  dispatch(getProgramsWithoutLoading());
};

export const getProgramsWithoutLoading = () => dispatch => {
  axios
    .get("/api/program")
    .then(res =>
      dispatch({
        type: GET_PROGRAMS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const createProgram = (deptID, deptName) => dispatch => {
  // dispatch(setProgramLoading());
  axios
    .post("/api/program/create", { deptID: deptID, deptName: deptName })
    .then(res => dispatch(getProgramsWithoutLoading()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Loading Profile
export const setProgramLoading = () => {
  return {
    type: PROGRAM_LOADING
  };
};

export const getProgram = deptName => dispatch => {
  dispatch(setProgramLoading());
  axios
    .get(`/api/program/${deptName}`)
    .then(res =>
      dispatch({
        type: GET_SINGLE_PROGRAM,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addProgramAdmin = (deptName, adminEmail) => dispatch => {
  // dispatch(setProgramLoading());
  axios
    .post(`/api/program/${deptName}/addAdmin`, { adminEmail: adminEmail })
    .then(res => {
      console.log(res.data);
      dispatch({
        type: ADD_PROGRAM_ADMIN,
        payload: res.data.admin
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const removeProgramAdmin = (deptID, adminEmail) => dispatch => {
  // dispatch(setProgramLoading());
  axios
    .delete(`/api/program/${deptID}/deleteAdmin`, {
      data: { adminEmail: adminEmail }
    })
    .then(res => {
      console.log(res.data);
      dispatch({
        type: ADD_PROGRAM_ADMIN,
        payload: res.data.admin
      });
      Swal.fire("Deleted!", `${adminEmail} has been deleted.`, "success");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });

      if (err.response.data.Outcomes) {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: err.response.data
        });
      }
    });
};

export const updateProgramName = (deptID, newDeptName) => dispatch => {
  // dispatch(setProgramLoading());
  axios
    .put(`/api/program/${deptID}/update/name`, { deptName: newDeptName })
    .then(res => {
      console.log(res.data);
      dispatch({
        type: UPDATE_PROGRAM_NAME,
        payload: res.data
      });
      toastr.success(
        "Department Name Updated!",
        "The new department name is " + newDeptName
      );
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const updateProgramID = (deptID, newDeptID) => dispatch => {
  // dispatch(setProgramLoading());
  axios
    .put(`/api/program/${deptID}/update/id`, { deptID: newDeptID })
    .then(res => {
      console.log(res.data);
      dispatch({
        type: UPDATE_PROGRAM_ID,
        payload: res.data
      });
      toastr.success(
        "Department ID Updated!",
        "The new department name is " + newDeptID
      );
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      if (err.response.data.Dept_ID)
        toastr.error("ERROR!", err.response.data.Dept_ID);
    });
};

export const deleteProgram = deptID => dispatch => {
  // dispatch(setProgramLoading());
  axios
    .delete(`/api/program/${deptID}`)
    .then(res => {
      console.log(res.data);
      dispatch({
        type: DELETE_PROGRAM,
        payload: res.data.admin
      });
      Swal.fire("Deleted!", `${deptID} has been deleted.`, "success").then(
        result => console.log(result.value)
      );
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });

      if (err.response.data.Dept_ID) {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: err.response.data.Dept_ID
        });
      }
    });
};
