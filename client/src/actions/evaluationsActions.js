import axios from "axios";
import {
  LIST_ASSIGNED_RUBRICS,
  ASSIGNED_RUBRICS_LOADING,
  VIEW_MEASURE_RUBRIC,
  GRADE_STUDENT_RUBRIC_MEASURE,
  VIEW_STUDENT_GRADE_RUBRIC_MEASURE,
  LIST_ASSIGNED_TESTS,
  VIEW_MEASURE_TEST,
  GET_ERRORS,
  SUBMIT_RUBRIC_TASK,
  SUBMIT_TEST_TASK
} from "./types";
import { toastr } from "react-redux-toastr";
import Swal from "sweetalert2";
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
  console.log(RubricMeasureID, studentID, Score);
  // dispatch(setRubricsLoading());
  axios
    .post(
      `/api/evaluations/rubricMeasure/${RubricMeasureID}/student/${studentID}`,
      { Score: Score }
    )
    .then(res => {
      // dispatch({
      //   type: GRADE_STUDENT_RUBRIC_MEASURE,
      //   payload: res.data
      // });
      console.log(res.data);
      console.log("Successful");
      toastr.success("Student Graded!");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      console.log("error");
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
      console.log(err.response.data);
      // toastr.error(err.response.data);
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
    .then(res => {
      dispatch(viewTestMeasure(Test_Measure_ID));
      toastr.success(
        "Student Graded!",
        "Students graded using file upload method"
      );
    })
    .catch(err => {
      dispatch(viewTestMeasure(Test_Measure_ID));
      toastr.error("Error occured", "Student grade not added");
    });
};

export const submitRubricTask = rubricMeasureID => dispatch => {
  axios
    .post(`/api/evaluations/rubricMeasure/${rubricMeasureID}/submit`)
    .then(res => {
      Swal.fire(
        "Task Submitted!",
        "Program coordinator has been notified of your work!",
        "success"
      );
      dispatch({
        type: SUBMIT_RUBRIC_TASK,
        payload: { hasSubmitted: "true" }
      });
    })
    .catch(err => {
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: err.response.data.submit
      });
    });
};

export const submitTestTask = testMeasureID => dispatch => {
  axios
    .post(`/api/evaluations/testMeasure/${testMeasureID}/submit`)
    .then(res => {
      Swal.fire(
        "Task Submitted!",
        "Program coordinator has been notified of your work!",
        "success"
      );
      dispatch({
        type: SUBMIT_TEST_TASK,
        payload: { hasSubmitted: "true" }
      });
    })
    .catch(err => {
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: err.response.data.submit
      });
    });
};
