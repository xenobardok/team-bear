const Validator = require("validator");
const isEmpty = require("./isEmpty");
const db = require("../config/connection");

module.exports = function validateAddEvaluatorInput(data) {
  var errors = {};

  if (!Validator.isLength(data.newEmail, { min: 9, max: 30 })) {
    errors.email = "Email is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
