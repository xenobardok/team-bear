import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import profileReducer from "./profileReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import rubricsReducer from "./rubricsReducer";
import cycleReducer from "./cycleReducer";
import measureReducer from "./measureReducer";
import evaluationsReducer from "./evaluationsReducer";

export default combineReducers({
  toastr: toastrReducer,
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  rubrics: rubricsReducer,
  cycles: cycleReducer,
  measures: measureReducer,
  evaluations: evaluationsReducer
});
