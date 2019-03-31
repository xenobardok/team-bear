import axios from "axios";
import { LIST_ASSIGNED_RUBRICS, ASSIGNED_RUBRICS_LOADING } from "./types";

export const listAssignedRubrics = () => dispatch => {
  dispatch(setRubricsLoading());
  axios
    .get("/api/evaluations/rubrics")
    .then(res =>
      dispatch({
        type: LIST_ASSIGNED_RUBRICS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: LIST_ASSIGNED_RUBRICS,
        payload: []
      });
    });
};

export const setRubricsLoading = () => {
  return {
    type: ASSIGNED_RUBRICS_LOADING
  };
};
