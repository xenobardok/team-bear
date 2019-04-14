import {
  GET_CYCLES,
  GET_SINGLE_CYCLE,
  LOADING,
  CREATE_CYCLE
} from "../actions/types";

const initialState = {
  activeCycle: 1,
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
    case CREATE_CYCLE:
      return {
        ...state,
        loading: false,
        allCycles: [...state.allCycles, action.payload]
      };
    default:
      return state;
  }
}
