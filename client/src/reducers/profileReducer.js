import {
  GET_CURRENT_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_EVALUATORS
} from "../actions/types";

const initialState = {
  profile: null,
  evaluators: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CURRENT_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false
      };
    case GET_EVALUATORS:
      return {
        ...state,
        evaluators: action.payload
      };
    default:
      return state;
  }
}
