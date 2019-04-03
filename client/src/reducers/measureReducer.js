import {
  GET_MEASURES,
  MEASURE_LOADING,
  GET_SINGLE_MEASURE,
  ADD_EVALUATOR_MEASURE,
  ADD_STUDENT,
  REMOVE_STUDENT,
  UPDATE_MEASURE_DEFINITION
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
    case UPDATE_MEASURE_DEFINITION:
      return {
        ...state,
        singleMeasure: {
          ...state.singleMeasure,
          ...action.payload
        }
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
    case ADD_STUDENT:
      console.log(action.payload);
      return {
        ...state,
        singleMeasure: {
          ...state.singleMeasure,
          Students: [...state.singleMeasure.Students, action.payload]
        }
      };
    case REMOVE_STUDENT:
      console.log(...action.payload);
      return {
        ...state,
        singleMeasure: {
          ...state.singleMeasure,
          Students: [...action.payload]
        }
      };

    default:
      return state;
  }
}
