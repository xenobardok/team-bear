import axios from "axios";
import {
  GET_PROGRAMS,
  GET_ERRORS,
  PROGRAM_LOADING,
  CREATE_PROGRAM,
  GET_SINGLE_PROGRAM
} from "./types";
import { toastr } from "react-redux-toastr";

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
        payload: err.response.data //res?? not sure
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
        payload: err.response.data //res?? not sure
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
        payload: err.response.data //res?? not sure
      })
    );
};
