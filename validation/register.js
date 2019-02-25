const Validator = require("validator");
const isEmpty = require("./isEmpty");
const db = require("../config/connection");

module.exports = function validateRegisterInput(data) {
  var errors = {};

  if (!Validator.isLength(data.firstname, { min: 1, max: 20 })) {
    errors.firstname = "Firstname is required";
  }

  if (!Validator.isLength(data.lastname, { min: 1, max: 20 })) {
    errors.lastname = "Lastname is required";
  }
  if (!Validator.isLength(data.email, { min: 9, max: 30 })) {
    errors.email = "Email is required";
  }
  if (!Validator.isLength(data.password, { min: 5, max: 20 })) {
    errors.password = "Password must be between 5 and 20 characters";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Password does not match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
