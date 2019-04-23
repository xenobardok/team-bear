const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRubricInput(data) {
  let errors = {};

  if (isEmpty(data.Rubric_Name)) {
    errors.Rubric_Name = "Rubric Name cannot be empty.";
  }

  if (!Validator.isInt(data.Rows_Num)) {
    errors.Rows_Num = "Number of rows must be a number.";
  }

  if (data.Rows_Num < 1) {
    errors.Rows_Num = "Number of rows must be a positive number.";
  }
  if (isEmpty(data.Rows_Num)) {
    errors.Rows_Num = "Number of rows cannot be empty.";
  }
  if (data.Column_Num < 1) {
    errors.Column_Num = "Number of columns must be a positive number.";
  }
  if (!Validator.isInt(data.Column_Num)) {
    errors.Column_Num = "Number of columns must be a number.";
  }

  if (isEmpty(data.Column_Num)) {
    errors.Column_Num = "Number of columns cannot be empty.";
  }

  if (data.Scale.length == 0) {
    errors.Scale = "Scale  cannot be empty.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
