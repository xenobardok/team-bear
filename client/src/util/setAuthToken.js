import axios from "axios";

const setAuthToken = token => {
  if (token) {
    //Apply auth header to all page
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    //Delete auth
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
