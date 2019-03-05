import axios from "axios";
import {
  GET_RUBRICS,
  RUBRICS_LOADING,
  CREATE_RUBRIC,
  GET_ERRORS
} from "./types";

export const getRubrics = () => dispatch => {
  dispatch(setRubricsLoading());
  axios
    .get("/api/rubrics")
    .then(res =>
      dispatch({
        type: GET_RUBRICS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_RUBRICS,
        payload: []
      })
    );
};

export const setRubricsLoading = () => {
  return {
    type: RUBRICS_LOADING
  };
};

export const createRubric = rubric => dispatch => {
  axios
    .post("/api/rubrics/create")
    .then(res =>
      dispatch({
        type: CREATE_RUBRIC,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        dispatch: err.response.data
      })
    );
};
