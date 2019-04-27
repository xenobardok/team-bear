import {
  GENERATE_MEASURE_REPORT,
  REPORT_LOADING,
  GENERATE_OUTCOME_REPORT,
  GENERATE_CYCLE_REPORT,
  GET_SUBMITTED_CYCLES
} from "../actions/types";

const initialState = {
  report: null,
  loading: false,
  cycles: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REPORT_LOADING:
      return {
        ...state,
        loading: true
      };
    case GENERATE_MEASURE_REPORT:
      return {
        ...state,
        loading: false,
        report: action.payload
      };
    case GENERATE_OUTCOME_REPORT:
      return {
        ...state,
        loading: false,
        report: action.payload
      };
    case GENERATE_CYCLE_REPORT:
      return {
        ...state,
        loading: false,
        report: action.payload
      };
    case GET_SUBMITTED_CYCLES:
      return {
        ...state,
        loading: false,
        cycles: action.payload
      };
    default:
      return state;
  }
}
