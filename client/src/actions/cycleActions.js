import axios from "axios";
import { GET_CYCLES } from "./types";

export const getCycles = () => dispatch => {
  axios.get("/api/cycle").then(res =>
    dispatch({
      type: GET_CYCLES,
      payload: res.data
    })
  );
};
