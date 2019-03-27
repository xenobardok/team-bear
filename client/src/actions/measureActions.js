import axios from "axios";
import { GET_MEASURES, MEASURE_LOADING, GET_ERRORS } from "./types";

export const getMeasures = id => dispatch => {
  //   dispatch(setMeasureLoading());
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

export const createNewRubricMeasure = (
  Outcome_ID,
  Measure_Name
) => dispatch => {
  console.log(Measure_Name);
  axios
    .post(`/api/cycle/outcome/${Outcome_ID}/createRubricMeasure`, {
      Measure_Name: Measure_Name
    })
    .then(res => {
      console.log(res.data);
      console.log("Create new measure");
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
