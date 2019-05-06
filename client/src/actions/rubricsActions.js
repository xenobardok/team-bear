import axios from "axios";
import {
  GET_RUBRICS,
  LOADING,
  GET_ERRORS,
  GET_SINGLE_RUBRIC,
  SET_DATA_VALUE,
  SET_MEASURE_VALUE,
  RUBRICS_BUTTON_LOADING,
  DELETE_RUBRIC
} from "./types";
import { toastr } from "react-redux-toastr";
import Swal from "sweetalert2";
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

export const setRubricsButtonLoading = () => {
  return {
    type: RUBRICS_BUTTON_LOADING
  };
};

export const changeRubricWeight = (Rubric_ID, data) => dispatch => {
  // console.log(Rubric_ID, data);
  dispatch(setRubricsButtonLoading());
  axios
    .put(`/api/rubrics/${Rubric_ID}/weight`, data)
    .then(res => {
      toastr.success(
        "Rubric Weight Changed!",
        "Successfully changed rubric weight!"
      );
    })
    .catch(err => {
      if (err.response.status === 422) {
        toastr.error("Rubric weight must equal 100");
      }
    });
};

export const createRubric = rubric => dispatch => {
  axios
    .post("/api/rubrics/create", rubric)
    .then(res => {
      // console.log(
      //   "Successfully created axios request. Dispatching result now!"
      // );
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

export const deleteRubric = rubricID => dispatch => {
  // dispatch(setProgramLoading());
  // console.log(rubricID);
  axios
    .delete(`/api/rubrics/${rubricID}`)
    .then(res => {
      Swal.fire("Deleted!", `Rubric has been deleted.`, "success");
      dispatch(getRubrics());
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });

      if (err.response.data.Rubric_ID) {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: err.response.data.Rubric_ID
        });
      }
    });
};
