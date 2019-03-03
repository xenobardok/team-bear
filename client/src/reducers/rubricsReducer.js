import { GET_RUBRICS, RUBRICS_LOADING } from "../actions/types";

const initialState = {
  allRubrics: null,
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
    default:
      return state;
  }
}
