import { combineReducers } from "redux";
import profileReducer from "./profileReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import rubricsReducer from "./rubricsReducer";
import cycleReducer from "./cycleReducer";
import measureReducer from "./measureReducer";
import evaluationsReducer from "./evaluationsReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  rubrics: rubricsReducer,
  cycles: cycleReducer,
  measures: measureReducer,
  evaluations: evaluationsReducer
});
