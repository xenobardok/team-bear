import { CURRENT_USER } from "./type";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CURRENT_USER:
      this.state.isAuthenticated = true;
      this.state.user = action.payload;
      return state;
    default:
      return state;
  }
}
