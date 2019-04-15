import axios from "axios";
import { GENERATE_MEASURE_REPORT, REPORT_LOADING, GET_ERRORS } from "./types";

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
        type: GET_ERRORS
      })
    );
};

export const reportLoading = () => {
  return {
    type: REPORT_LOADING
  };
};
