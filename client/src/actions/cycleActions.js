import axios from "axios";
import {
  GET_CYCLES,
  LOADING,
  GET_SINGLE_CYCLE,
  GET_ERRORS,
  CREATE_CYCLE
} from "./types";
import { toastr } from "react-redux-toastr";
import Swal from "sweetalert2";

export const getCycles = () => dispatch => {
  dispatch(setCycleLoading());
  axios.get("/api/cycle").then(res =>
    dispatch({
      type: GET_CYCLES,
      payload: res.data
    })
  );
};
export const updateCycleName = (cycleID, Cycle_Name) => dispatch => {
  dispatch(setCycleLoading());
  axios
    .put(`/api/cycle/${cycleID}`, { Cycle_Name: Cycle_Name })
    .then(res => {
      dispatch(getCyclesWithoutLoading());
      toastr.success(
        "Cycle Name Updated!",
        "The new cycle name is " + Cycle_Name
      );
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      toastr.error("Cycle Name Update Error!", err.response.data.error);
    });
};

export const getCyclesWithoutLoading = () => dispatch => {
  axios.get("/api/cycle").then(res =>
    dispatch({
      type: GET_CYCLES,
      payload: res.data
    })
  );
};

export const getSingleCycle = id => dispatch => {
  dispatch(setCycleLoading());
  axios
    .get(`/api/cycle/${id}`)
    .then(res => {
      dispatch({
        type: GET_SINGLE_CYCLE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_SINGLE_CYCLE,
        payload: null
      })
    );
};

export const setCycleLoading = () => {
  return {
    type: LOADING
  };
};

export const createCycle = cycleName => dispatch => {
  console.log(cycleName);
  axios
    .post("/api/cycle/create", cycleName)
    .then(res => {
      console.log(
        "Successfully created axios request. Dispatching result now!"
      );
      // console.log(res.data.Cycle_ID);
      dispatch({
        type: CREATE_CYCLE,
        payload: res.data
      });
      toastr.success(
        "New Cycle Created!",
        res.data.Cycle_Name + " created successfully!"
      );
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const migrateCycle = (Cycle_Name, migrateCycleID) => dispatch => {
  console.log(Cycle_Name, migrateCycleID);
  axios
    .post(`/api/migrate/cycle/${migrateCycleID}`, { Cycle_Name: Cycle_Name })
    .then(res => {
      dispatch(getCyclesWithoutLoading());
      toastr.success(
        "New Cycle Created!",
        "Cycle migration completed successfully!"
      );
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      toastr.error("Cycle Migration Error!", err.response.data.error);
    });
};

export const submitCycle = CycleID => dispatch => {
  console.log(CycleID);
  axios
    .put(`/api/cycle/${CycleID}/submit`)
    .then(res => {
      dispatch(getCyclesWithoutLoading());
      Swal.fire(
        "Cycle Submitted!",
        "Please view the reports from the Reports link on the sidebar!",
        "success"
      );
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: err.response.data.error
      });
    });
};

export const deleteCycle = cycleID => dispatch => {
  axios
    .delete(`/api/cycle/${cycleID}`)
    .then(res => {
      Swal.fire("Deleted!", "Your cycle has been deleted.", "success");
      dispatch(getCyclesWithoutLoading());
    })
    .catch(err => {
      if (err.response.data.Outcomes) {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: "The cycle contains outcomes. Please delete them first!"
        });
      }
      console.log(err.response.data);
    });
};

export const createNewOutcome = (
  id,
  Outcome_Name,
  curriculumMap
) => dispatch => {
  console.log(id, Outcome_Name, curriculumMap);
  axios
    .post(`/api/cycle/${id}/outcome/create`, {
      Outcome_Name: Outcome_Name,
      Class_Factors: curriculumMap
    })
    .then(res => {
      dispatch(getSingleCycle(id));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const updateOutcome = (cycleID, outcomeID, Outcome_Name) => dispatch => {
  axios
    .post(`/api/cycle/${cycleID}/outcome/${outcomeID}/update`, {
      Outcome_Name: Outcome_Name
    })
    .then(res => {
      console.log("Successfully updated outcome");
      dispatch(getSingleCycle(cycleID));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteOutcome = (cycleID, outcomeID) => dispatch => {
  axios
    .delete(`/api/cycle/${cycleID}/outcome/${outcomeID}`)
    .then(res => {
      console.log(res.data);
      Swal.fire("Deleted!", "Your outcome has been deleted.", "success");
      dispatch(getSingleCycle(cycleID));
    })
    .catch(err => {
      if (err.response.data.Measures) {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: "The outcome contains measures. Please delete them first!"
        });
      } else {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: "Internal server error. Please contact app developers!"
        });
      }
    });
};
