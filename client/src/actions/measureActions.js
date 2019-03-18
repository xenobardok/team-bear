import axios from "axios";
import { GET_MEASURES, MEASURE_LOADING } from "./types";

export const getMeasures = id => dispatch => {
  //   dispatch(setMeasureLoading());
  console.log(id);
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

export const setMeasureLoading = () => ({
  type: MEASURE_LOADING
});
