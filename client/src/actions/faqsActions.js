import axios from "axios";
import { GET_FAQS } from "./types";
import { toastr } from "react-redux-toastr";
import Swal from "sweetalert2";

export const getFaqs = () => dispatch => {
  axios
    .get("/api/faq")
    .then(res =>
      dispatch({
        type: GET_FAQS,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

export const createFaq = (question, answer) => dispatch => {
  axios
    .post("/api/faq/create", { Question: question, Answer: answer })
    .then(res => {
      //   console.log(res);
      dispatch(getFaqs());
      toastr.success("Success!", "New FAQ created");
    })
    .catch(err => toastr.error("Error"));
};

export const updateFaq = (faqID, question, answer) => dispatch => {
  axios
    .put(`/api/faq/${faqID}`, { Question: question, Answer: answer })
    .then(res => {
      //   console.log(res);
      dispatch(getFaqs());
      toastr.success("Success!", "FAQ Updated");
    })
    .catch(err => toastr.error("Error"));
};

export const deleteFaq = faqID => dispatch => {
  axios
    .delete(`/api/faq/${faqID}`)
    .then(res => {
      //   console.log(res);
      dispatch(getFaqs());
      Swal.fire("Deleted!", "This faq has been deleted.", "success");
    })
    .catch(err => toastr.error("Error"));
};
