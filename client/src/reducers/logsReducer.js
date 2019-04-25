import { GET_LOGS, LOADING_LOGS } from "../actions/types";

const initialState = {
  logs: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_LOGS:
      return {
        ...state,
        loading: true
      };
    case GET_LOGS:
      return {
        ...state,
        logs: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
