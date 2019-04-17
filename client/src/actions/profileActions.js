import axios from "axios";
import {
  GET_CURRENT_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  CLEAR_CURRENT_PROFILE,
  GET_EVALUATORS,
  ADD_EVALUATOR,
  CANCEL_EVALUATOR_INVITE
} from "./types";
import { toastr } from "react-redux-toastr";
// Get Current Profile

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/dashboard")
    .then(res =>
      dispatch({
        type: GET_CURRENT_PROFILE,
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

// Loading Profile
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

export const getEvaluators = () => dispatch => {
  axios
    .get("/api/users/evaluators")
    .then(res =>
      dispatch({
        type: GET_EVALUATORS,
        payload: res.data
      })
    )
    .catch(err => console.log(err.response.data));
};

export const addEvaluator = newEmail => dispatch => {
  axios
    .post("/api/users/addEvaluator", { newEmail: newEmail })
    .then(res => {
      dispatch({
        type: ADD_EVALUATOR,
        payload: res.data
      });
      toastr.success(
        "Evaluator added!",
        `We've sent email to ${res.data} with instructions to register!`
      );
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const removeEvaluator = removeEmail => dispatch => {
  axios
    .delete("/api/users/cancelInvite", { data: { removeEmail: removeEmail } })
    .then(res =>
      dispatch({
        type: CANCEL_EVALUATOR_INVITE,
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
