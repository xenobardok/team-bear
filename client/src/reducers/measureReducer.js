import {
  GET_MEASURES,
  MEASURE_LOADING,
  GET_SINGLE_MEASURE,
  ADD_EVALUATOR_MEASURE,
  ADD_STUDENT,
  REMOVE_STUDENT,
  UPDATE_MEASURE_DEFINITION,
  ADD_STUDENT_LOADING,
  ADD_STUDENT_FROM_FILE,
  ERROR_FILE_UPLOAD,
  REMOVE_EVALUATOR_MEASURE
} from "../actions/types";

const initialState = {
  measure: null,
  singleMeasure: null,
  loading: true,
  studentsLoading: false
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
        studentsLoading: false,
        singleMeasure: {
          ...state.singleMeasure,
          Students: [...state.singleMeasure.Students, action.payload]
        }
      };
    case ADD_STUDENT_FROM_FILE:
      console.log(action.payload);
      return {
        ...state,
        studentsLoading: false,
        singleMeasure: {
          ...state.singleMeasure,
          Students: action.payload
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
    case ADD_STUDENT_LOADING: {
      return {
        ...state,
        studentsLoading: true
      };
    }
    case ERROR_FILE_UPLOAD: {
      return {
        ...state,
        studentsLoading: false,
        singleMeasure: {
          ...state.singleMeasure,
          Students: [...state.singleMeasure.Students]
        }
      };
    }
    case REMOVE_EVALUATOR_MEASURE:
      return {
        ...state,
        singleMeasure: {
          ...state.singleMeasure,
          Evaluators: state.singleMeasure.Evaluators.filter(
            value => value.Evaluator_Email !== action.payload.Evaluator_Email
          )
        }
      };
    default:
      return state;
  }
}
