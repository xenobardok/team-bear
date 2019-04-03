import {
  LIST_ASSIGNED_RUBRICS,
  ASSIGNED_RUBRICS_LOADING,
  VIEW_MEASURE_RUBRIC,
  VIEW_STUDENT_GRADE_RUBRIC_MEASURE,
  GRADE_STUDENT_RUBRIC_MEASURE
} from "../actions/types";

const initialState = {
  allRubrics: [],
  rubric: null,
  loading: true,
  studentGrade: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ASSIGNED_RUBRICS_LOADING:
      return {
        ...state,
        loading: true
      };
    case LIST_ASSIGNED_RUBRICS:
      return {
        ...state,
        allRubrics: action.payload,
        loading: false
      };
    case VIEW_MEASURE_RUBRIC:
      return {
        ...state,
        rubric: action.payload,
        loading: false
      };
    case VIEW_STUDENT_GRADE_RUBRIC_MEASURE:
      return {
        ...state,
        studentGrade: action.payload,
        loading: false
      };
    case GRADE_STUDENT_RUBRIC_MEASURE:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
