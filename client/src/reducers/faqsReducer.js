import { GET_FAQS } from "../actions/types";
import isEmpty from "../validation/isEmpty";

const initialState = {
  allFaqs: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_FAQS:
      return {
        ...state,
        loading: false,
        allFaqs: action.payload
      };
    default:
      return state;
  }
}
