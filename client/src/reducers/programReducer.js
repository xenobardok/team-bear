import { PROGRAM_LOADING, GET_PROGRAMS } from "../actions/types";

const initialState = {
  programs: null,
  program: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROGRAM_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROGRAMS:
      return {
        ...state,
        programs: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
