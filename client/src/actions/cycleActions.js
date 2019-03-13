import axios from "axios";
import { GET_CYCLES, LOADING, GET_SINGLE_CYCLE } from "./types";

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
