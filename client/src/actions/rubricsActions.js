import axios from "axios";
import { GET_RUBRICS, RUBRICS_LOADING } from "./types";

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

export const setRubricsLoading = () => {
  return {
    type: RUBRICS_LOADING
  };
};
