import axios from "axios";
import {
  GET_RUBRICS,
  LOADING,
  GET_ERRORS,
  GET_SINGLE_RUBRIC,
  SET_DATA_VALUE,
  SET_MEASURE_VALUE
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
    .then(res => {
      dispatch({
        type: GET_SINGLE_RUBRIC,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_RUBRICS,
        payload: null
      })
    );
};

export const setRubricsLoading = () => {
  return {
    type: LOADING
  };
};

export const createRubric = rubric => dispatch => {
  axios
    .post("/api/rubrics/create", rubric)
    .then(res => {
      console.log(
        "Successfully created axios request. Dispatching result now!"
      );
      dispatch(getSingleRubric(res.data.Rubric_ID));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const setMeasureValue = (id, Measure_Factor) => dispatch => {
  axios
    .post(`/api/rubrics/measure/update/${id}`, {
      Measure_Factor: Measure_Factor
    })
    .then(res => {
      dispatch({
        type: SET_MEASURE_VALUE,
        payload: res.data
      });
    })
    .catch(err => ({
      type: GET_ERRORS,
      payload: err.response.data
    }));
};

export const setDataValue = (id, value) => dispatch => {
  axios
    .post(`/api/rubrics/column/update/${id}`, {
      Value: value
    })
    .then(res => {
      dispatch({
        type: SET_DATA_VALUE,
        payload: res.data
      });
    })
    .catch(err => ({
      type: GET_ERRORS,
      payload: err.response.data
    }));
};
