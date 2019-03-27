import {
  GET_MEASURES,
  MEASURE_LOADING,
  GET_SINGLE_MEASURE
} from "../actions/types";

const initialState = {
  measure: null,
  singleMeasure: null,
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
    case GET_SINGLE_MEASURE:
      return {
        ...initialState,
        singleMeasure: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
