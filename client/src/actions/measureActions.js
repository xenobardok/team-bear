import axios from "axios";
import {
  GET_MEASURES,
  MEASURE_LOADING,
  GET_ERRORS,
  GET_SINGLE_MEASURE,
  ADD_EVALUATOR_MEASURE,
  ADD_STUDENT
} from "./types";

export const getMeasures = id => dispatch => {
  dispatch(setMeasureLoading());
  axios
    .get(`/api/cycle/outcome/${id}`)
    .then(res => {
      dispatch({
        type: GET_MEASURES,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_MEASURES,
        payload: null
      })
    );
};

export const createMeasure = (
  Outcome_ID,
  Measure_Name,
  Measure_Type
) => dispatch => {
  console.log(Measure_Name, Measure_Type);
  axios
    .post(`/api/cycle/outcome/${Outcome_ID}/measure/create`, {
      Measure_Name: Measure_Name,
      Measure_Type: Measure_Type
    })
    .then(res => {
      console.log(res.data);
      console.log("Create new measure");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const setMeasureLoading = () => ({
  type: MEASURE_LOADING
});

export const getSingleMeasure = (outcomeID, measureID) => dispatch => {
  dispatch(setMeasureLoading());
  axios
    .get(`/api/cycle/outcome/${outcomeID}/measure/${measureID}`)
    .then(res => {
      dispatch({
        type: GET_SINGLE_MEASURE,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_SINGLE_MEASURE,
        payload: null
      });
    });
};

export const assignEvaluatorToMeasure = (
  measureID,
  Evaluator_Email
) => dispatch => {
  console.log(
    "Doing axios request with measureID " +
      measureID +
      " and email " +
      Evaluator_Email
  );
  axios
    .post(`/api/cycle/measure/${measureID}/addEvaluator`, {
      Evaluator_Email: Evaluator_Email
    })
    .then(res =>
      dispatch({
        type: ADD_EVALUATOR_MEASURE,
        payload: res.data
      })
    );
};

export const defineMeasure = (
  outcomeID,
  measureID,
  measureData
) => dispatch => {
  console.log(measureID);
  console.log(measureData);
  axios
    .post(`/api/cycle/measure/${measureID}/update`, measureData)
    .then(res => dispatch(getSingleMeasure(outcomeID, measureID)))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const addStudent = (measureID, student) => dispatch => {
  console.log(measureID);
  console.log(student);
  axios
    .post(`/api/cycle/measure/${measureID}/addStudent`, student)
    .then(res => dispatch({ type: ADD_STUDENT, payload: res.data }))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
