import axios from "axios";
import {
  GET_CYCLES,
  LOADING,
  GET_SINGLE_CYCLE,
  GET_ERRORS,
  GET_MEASURES
} from "./types";

export const getCycles = () => dispatch => {
  axios.get("/api/cycle").then(res =>
    dispatch({
      type: GET_CYCLES,
      payload: res.data
    })
  );
};

export const getSingleCycle = id => dispatch => {
  dispatch(setCycleLoading());
  axios
    .get(`/api/cycle/${id}`)
    .then(res => {
      dispatch({
        type: GET_SINGLE_CYCLE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_SINGLE_CYCLE,
        payload: null
      })
    );
};

export const setCycleLoading = () => {
  return {
    type: LOADING
  };
};

export const createCycle = cycleName => dispatch => {
  console.log(cycleName);
  axios
    .post("/api/cycle/create", cycleName)
    .then(res => {
      console.log(
        "Successfully created axios request. Dispatching result now!"
      );
      // console.log(res.data.Cycle_ID);
      dispatch(getSingleCycle(res.data.Cycle_ID));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const createNewOutcome = (id, Outcome_Name) => dispatch => {
  console.log(id, Outcome_Name);
  axios
    .post(`/api/cycle/${id}/outcome/create`, { Outcome_Name: Outcome_Name })
    .then(res => {
      dispatch(getSingleCycle(id));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
