import {
  GET_RUBRICS,
  LOADING,
  GET_SINGLE_RUBRIC,
  DELETE_RUBRIC
} from "../actions/types";

const initialState = {
  allRubrics: null,
  rubric: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_RUBRICS:
      return {
        ...state,
        allRubrics: action.payload,
        loading: false
      };
    case GET_SINGLE_RUBRIC:
      return {
        ...state,
        rubric: action.payload,
        loading: false
      };
    case DELETE_RUBRIC:
      return {
        ...state,
        rubric: {
          ...state.rubric,
          deleted: true
        }
      };
    default:
      return state;
  }
}
