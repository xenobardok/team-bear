import { GET_CYCLES } from "../actions/types";

const initialState = {
  allCycles: null,
  cycles: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CYCLES:
      return {
        ...state,
        allCycles: action.payload,
        loading: false
      };
    //   case GET_SINGLE_RUBRIC:
    //     return {
    //       ...state,
    //       rubric: action.payload,
    //       loading: false
    //     };
    default:
      return state;
  }
}
