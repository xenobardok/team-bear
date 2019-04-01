import {
  LIST_ASSIGNED_RUBRICS,
  ASSIGNED_RUBRICS_LOADING,
  VIEW_MEASURE_RUBRIC
} from "../actions/types";

const initialState = {
  allRubrics: [],
  rubric: null,
  loading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ASSIGNED_RUBRICS_LOADING:
      return {
        ...state,
        loading: true
      };
    case LIST_ASSIGNED_RUBRICS:
      return {
        ...state,
        allRubrics: action.payload,
        loading: false
      };
    case VIEW_MEASURE_RUBRIC:
      return {
        ...state,
        rubric: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
