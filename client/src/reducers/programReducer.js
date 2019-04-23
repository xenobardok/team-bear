import {
  PROGRAM_LOADING,
  GET_PROGRAMS,
  GET_SINGLE_PROGRAM,
  ADD_PROGRAM_ADMIN,
  UPDATE_PROGRAM_ID,
  UPDATE_PROGRAM_NAME
} from "../actions/types";

const initialState = {
  programs: null,
  program: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROGRAM_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROGRAMS:
      return {
        ...state,
        programs: action.payload,
        loading: false
      };
    case GET_SINGLE_PROGRAM:
      return {
        ...state,
        program: action.payload,
        loading: false
      };
    case ADD_PROGRAM_ADMIN:
      return {
        ...state,
        program: {
          ...state.program,
          admin: action.payload
        },
        loading: false
      };
    case UPDATE_PROGRAM_ID:
      return {
        ...state,
        program: {
          ...state.program,
          Dept_ID: action.payload.Dept_ID,
          Dept_Name: action.payload.Dept_Name
        },
        loading: false
      };
    case UPDATE_PROGRAM_NAME:
      return {
        ...state,
        program: {
          ...state.program,
          Dept_ID: action.payload.Dept_ID,
          Dept_Name: action.payload.Dept_Name
        },
        loading: false
      };
    default:
      return state;
  }
}
