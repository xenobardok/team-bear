import { GET_CYCLES, GET_SINGLE_CYCLE, LOADING } from "../actions/types";

const initialState = {
  allCycles: null,
  cycle: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CYCLES:
      return {
        ...state,
        allCycles: action.payload,
        loading: false
      };
    case GET_SINGLE_CYCLE:
      return {
        ...state,
        cycle: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
