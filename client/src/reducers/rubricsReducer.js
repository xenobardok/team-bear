import { GET_RUBRICS, RUBRICS_LOADING, CREATE_RUBRIC } from "../actions/types";

const initialState = {
  allRubrics: null,
  rubric: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RUBRICS_LOADING:
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
    case CREATE_RUBRIC:
      return {
        ...state,
        rubric: action.payload
      };
    default:
      return state;
  }
}
