import {
  LIST_ASSIGNED_RUBRICS,
  ASSIGNED_RUBRICS_LOADING
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
    default:
      return state;
  }
}
