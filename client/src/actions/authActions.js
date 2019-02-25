import axios from "axios";
import setAuthToken from "../util/setAuthToken";
import jwt_decode from "jwt-decode";
import { SET_CURRENT_USER, GET_ERRORS } from "./types";

// Login Get User token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      //Decode user token
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
