import axios from "axios";
import {
  LIST_ASSIGNED_RUBRICS,
  ASSIGNED_RUBRICS_LOADING,
  VIEW_MEASURE_RUBRIC
} from "./types";

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

export const viewRubricMeasure = RubricMeasureID => dispatch => {
  dispatch(setRubricsLoading());
  axios
    .get(`/api/evaluations/rubrics/${RubricMeasureID}`)
    .then(res =>
      dispatch({
        type: VIEW_MEASURE_RUBRIC,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};
