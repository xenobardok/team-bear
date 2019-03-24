import axios from "axios";
import { GET_MEASURES, MEASURE_LOADING } from "./types";

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

// export const createNewRubricMeasure = (id, Outcome_Name) => dispatch => {
//   console.log(id, Outcome_Name);
//   axios
//     .post(`/api/cycle/${id}/outcome/create`, { Outcome_Name: Outcome_Name })
//     .then(res => {
//       dispatch(getSingleCycle(id));
//     })
//     .catch(err => {
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       });
//     });
// };

export const setMeasureLoading = () => ({
  type: MEASURE_LOADING
});
