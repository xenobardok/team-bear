import {
  GET_MEASURES,
  MEASURE_LOADING,
  GET_SINGLE_MEASURE,
  ADD_EVALUATOR_MEASURE
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
        ...state,
        loading: true
      };
    case GET_MEASURES:
      return {
        ...state,
        measure: action.payload,
        loading: false
      };
    case GET_SINGLE_MEASURE:
      return {
        ...state,
        singleMeasure: action.payload,
        loading: false
      };
    case ADD_EVALUATOR_MEASURE:
      return {
        ...state,
        singleMeasure: {
          ...state.singleMeasure,
          Evaluators: [...state.singleMeasure.Evaluators, action.payload]
        },
        loading: false
      };
    default:
      return state;
  }
}
