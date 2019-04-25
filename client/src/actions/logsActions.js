import axios from "axios";
import { GET_LOGS, GET_ERRORS, LOADING_LOGS } from "./types";

export const getLogs = () => dispatch => {
  dispatch(setLogsLoading());
  axios
    .get("/api/log")
    .then(res => {
      dispatch({
        type: GET_LOGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setLogsLoading = () => {
  return {
    type: LOADING_LOGS
  };
};
