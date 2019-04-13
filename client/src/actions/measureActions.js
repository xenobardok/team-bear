import axios from "axios";
import {
  GET_MEASURES,
  MEASURE_LOADING,
  GET_ERRORS,
  GET_SINGLE_MEASURE,
  ADD_EVALUATOR_MEASURE,
  ADD_STUDENT,
  REMOVE_STUDENT,
  UPDATE_MEASURE_DEFINITION,
  ADD_STUDENT_LOADING,
  ADD_STUDENT_FROM_FILE,
  ERROR_FILE_UPLOAD,
  REMOVE_EVALUATOR_MEASURE
} from "./types";
import { toastr } from "react-redux-toastr";
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
      dispatch(getMeasures(Outcome_ID));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const updateMeasureLabel = (
  Outcome_ID,
  Measure_ID,
  Measure_Name
) => dispatch => {
  console.log(Measure_Name);
  axios
    .post(`/api/cycle/outcome/${Outcome_ID}/measure/${Measure_ID}/edit`, {
      Measure_Name: Measure_Name
    })
    .then(res => {
      // dispatch(getMeasures(Outcome_ID));
      console.log("measure name updated");
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
    .then(res =>
      dispatch({ type: UPDATE_MEASURE_DEFINITION, payload: res.data })
    )
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
// { type: UPDATE_MEASURE_DEFINITION, payload: res.data }
// dispatch(getSingleMeasure(outcomeID, measureID))
export const addStudent = (measureID, student) => dispatch => {
  console.log(measureID);
  console.log(student);
  axios
    .post(`/api/cycle/measure/${measureID}/addStudent`, student)
    .then(res => {
      toastr.success(
        "Student added!",
        student.Student_Name + " added successfully!"
      );
      dispatch({ type: ADD_STUDENT, payload: res.data });
    })
    .catch(err => {
      toastr.error("Student not added!", err.response.data.error);
      dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};

export const addStudentsFromCSV = (measureID, file) => dispatch => {
  dispatch(addStudentLoading());
  axios
    .post(`/api/cycle/measure/${measureID}/addStudent/fileUpload`, file, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(res => dispatch({ type: ADD_STUDENT_FROM_FILE, payload: res.data }))
    .catch(err => {
      dispatch({ type: ERROR_FILE_UPLOAD, payload: [] });
      toastr.error("Duplicate ID(s) found", "Students not added!");
    });
};

export const removeStudent = (measureID, Student_ID) => dispatch => {
  console.log(measureID);
  console.log({ Student_ID: Student_ID });
  axios
    .delete(`/api/cycle/measure/${measureID}/removeStudent`, {
      data: {
        Student_ID: Student_ID
      }
    })
    .then(res => dispatch({ type: REMOVE_STUDENT, payload: res.data }))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const addStudentLoading = () => ({
  type: ADD_STUDENT_LOADING
});

export const removeEvaluatorMeasure = (
  measureID,
  Evaluator_Email
) => dispatch => {
  console.log(measureID, Evaluator_Email);
  axios
    .delete(`/api/cycle/measure/${measureID}/removeEvaluator`, {
      data: { Evaluator_Email: Evaluator_Email }
    })
    .then(res =>
      dispatch({
        type: REMOVE_EVALUATOR_MEASURE,
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
