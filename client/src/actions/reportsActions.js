import axios from "axios";
import {
  GENERATE_MEASURE_REPORT,
  REPORT_LOADING,
  GET_ERRORS,
  GENERATE_OUTCOME_REPORT
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
