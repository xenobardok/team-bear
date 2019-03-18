import { GET_MEASURES, MEASURE_LOADING } from "../actions/types";

const initialState = {
  measure: null,
  loading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MEASURE_LOADING:
      return {
        ...initialState,
        loading: true
      };
    case GET_MEASURES:
      return {
        ...initialState,
        measure: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
