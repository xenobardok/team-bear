import axios from "axios";
import {
  GET_CURRENT_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  CLEAR_CURRENT_PROFILE,
  GET_EVALUATORS
} from "./types";

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
    .get("/api/users/members")
    .then(res =>
      dispatch({
        type: GET_EVALUATORS,
        payload: res.data
      })
    )
    .catch(err => console.log(err.response.body));
};
