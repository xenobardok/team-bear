import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import profileReducer from "./profileReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import rubricsReducer from "./rubricsReducer";
import cycleReducer from "./cycleReducer";
import measureReducer from "./measureReducer";
import evaluationsReducer from "./evaluationsReducer";
import reportsReducer from "./reportsReducer";
import programReducer from "./programReducer";
import logsReducer from "./logsReducer";
import faqsReducer from "./faqsReducer";

export default combineReducers({
  toastr: toastrReducer,
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  rubrics: rubricsReducer,
  cycles: cycleReducer,
  measures: measureReducer,
  evaluations: evaluationsReducer,
  reports: reportsReducer,
  programs: programReducer,
  logs: logsReducer,
  faqs: faqsReducer
});
