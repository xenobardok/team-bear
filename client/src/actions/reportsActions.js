import axios from "axios";
import {
  GENERATE_MEASURE_REPORT,
  REPORT_LOADING,
  GET_ERRORS,
  GENERATE_OUTCOME_REPORT,
  GENERATE_CYCLE_REPORT,
  GET_SUBMITTED_CYCLES
} from "./types";

export const generateMeasureReport = measureID => dispatch => {
  dispatch(reportLoading());
  axios
    .get(`/api/reports/measure/${measureID}`)
    .then(res => {
      dispatch({
        type: GENERATE_MEASURE_REPORT,
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

export const reportLoading = () => {
  return {
    type: REPORT_LOADING
  };
};

export const generateOutcomeReport = outcomeID => dispatch => {
  dispatch(reportLoading());
  axios
    .get(`/api/reports/outcome/${outcomeID}`)
    .then(res => {
      dispatch({
        type: GENERATE_OUTCOME_REPORT,
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

export const generateCycleReport = CycleID => dispatch => {
  dispatch(reportLoading());
  axios
    .get(`/api/reports/cycle/${CycleID}`)
    .then(res => {
      dispatch({
        type: GENERATE_CYCLE_REPORT,
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

export const getSubmittedCycles = () => dispatch => {
  dispatch(reportLoading());
  axios
    .get("/api/cycle/submitted")
    .then(res =>
      dispatch({
        type: GET_SUBMITTED_CYCLES,
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
