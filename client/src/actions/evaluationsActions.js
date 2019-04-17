import axios from "axios";
import {
  LIST_ASSIGNED_RUBRICS,
  ASSIGNED_RUBRICS_LOADING,
  VIEW_MEASURE_RUBRIC,
  GRADE_STUDENT_RUBRIC_MEASURE,
  VIEW_STUDENT_GRADE_RUBRIC_MEASURE,
  LIST_ASSIGNED_TESTS,
  VIEW_MEASURE_TEST,
  GET_ERRORS
} from "./types";
import { toastr } from "react-redux-toastr";
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
    .get(`/api/evaluations/rubricMeasure/${RubricMeasureID}`)
    .then(res =>
      dispatch({
        type: VIEW_MEASURE_RUBRIC,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

export const viewTestMeasure = TestMeasureID => dispatch => {
  dispatch(setRubricsLoading());
  axios
    .get(`/api/evaluations/testMeasure/${TestMeasureID}`)
    .then(res =>
      dispatch({
        type: VIEW_MEASURE_TEST,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

export const viewStudentGradeRubricMeasure = (
  RubricMeasureID,
  studentID
) => dispatch => {
  axios
    .get(
      `/api/evaluations/rubricMeasure/${RubricMeasureID}/student/${studentID}`
    )
    .then(res =>
      dispatch({
        type: VIEW_STUDENT_GRADE_RUBRIC_MEASURE,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

export const gradeStudentRubricMeasure = (
  RubricMeasureID,
  studentID,
  Score
) => dispatch => {
  // console.log(RubricMeasureID, studentID, Score);
  // dispatch(setRubricsLoading());
  axios
    .post(
      `/api/evaluations/rubricMeasure/${RubricMeasureID}/student/${studentID}`,
      { Score: Score }
    )
    .then(res => {
      dispatch({
        type: GRADE_STUDENT_RUBRIC_MEASURE,
        payload: res.data
      });
      toastr.success("Student Graded!");
    })
    .catch(err => {
      toastr.error(err.response.data);
    });
};

export const listAssignedTests = () => dispatch => {
  dispatch(setRubricsLoading());
  axios
    .get("/api/evaluations/tests")
    .then(res =>
      dispatch({
        type: LIST_ASSIGNED_TESTS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: LIST_ASSIGNED_TESTS,
        payload: []
      });
    });
};

export const gradeStudentTestMeasure = (
  TestMeasureID,
  studentID,
  Score
) => dispatch => {
  // console.log(RubricMeasureID, studentID, Score);
  // dispatch(setRubricsLoading());
  axios
    .post(
      `/api/evaluations/testMeasure/${TestMeasureID}/student/${studentID}`,
      { Score: Score }
    )
    .then(res => {
      // dispatch({
      //   type: GRADE_STUDENT_RUBRIC_MEASURE,
      //   payload: res.data
      // });
      toastr.success("Student Graded!");
    })
    .catch(err => {
      toastr.error(err.response.data);
    });
};

export const studentFilefromCSV = (Test_Measure_ID, file) => dispatch => {
  dispatch(setRubricsLoading());
  console.log(Test_Measure_ID, file);
  axios
    .post(`/api/evaluations/testMeasure/${Test_Measure_ID}/fileUpload`, file, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(res => dispatch(listAssignedTests()))
    .catch(err => {
      dispatch(listAssignedTests());
      toastr.error("Error occured", "Student grade not added");
    });
};
