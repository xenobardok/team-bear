import { GENERATE_MEASURE_REPORT, REPORT_LOADING } from "../actions/types";

const initialState = {
  report: null,
  loading: false
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

    default:
      return state;
  }
}