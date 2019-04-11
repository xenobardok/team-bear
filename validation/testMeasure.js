const Validator = require("validator");
const isEmpty = require("./isEmpty");
const db = require("../config/connection");

module.exports = function validateUpdateTest(data) {
  var errors = {};

  if (!Validator.isFloat(data.Threshold)) {
    errors.Threshold = "% of students/teams must be a number";
  } else if (data.Threshold < 0 || data.Threshold > 100) {
    errors.Threshold = "% of students / teams must be between 0 and 100";
  }

  if (!Validator.isFloat(data.Target)) {
    errors.Target = "Target Score  must be  a number";
  }

  if (isEmpty(data.Test_Name)) {
    errors.Test_Name = "Test_Name cannot be empty";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
