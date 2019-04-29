import {
  SET_CURRENT_USER,
  RECENT_CYCLE,
  REGISTER_USER,
  CHANGE_NAME
} from "../actions/types";
import isEmpty from "../validation/isEmpty";

const initialState = {
  isAuthenticated: false,
  user: {},
  dashboard: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case RECENT_CYCLE:
      return {
        ...state,
        dashboard: action.payload
      };
    case REGISTER_USER:
      return {
        ...state,
        user: {
          registered: !isEmpty(action.payload)
        }
      };
    case CHANGE_NAME:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    default:
      return state;
  }
}
