import axios from "axios";
import {
  GET_RUBRICS,
  RUBRICS_LOADING,
  CREATE_RUBRIC,
  GET_ERRORS,
  GET_SINGLE_RUBRIC
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

export const getSingleRubric = id => dispatch => {
  dispatch(setRubricsLoading());
  axios
    .get(`/api/rubrics/${id}`)
    .then(res =>
      dispatch({
        type: GET_SINGLE_RUBRIC,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_RUBRICS,
        payload: null
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
    .post("/api/rubrics/create", rubric)
    .then(res => {
      console.log(
        "Successfully created axios request. Dispatching result now!"
      );
      console.log(res.data);
      dispatch({
        type: CREATE_RUBRIC,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const changeMeasureValue = id => dispatch => {};

export const changeDataValue = id => dispatch => {};
