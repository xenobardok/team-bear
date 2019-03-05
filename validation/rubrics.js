const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRubricInput(data) {
  let errors = {};

  if (!Validator.isLength(data.Rubric_Name, { min: 1, max: 50 })) {
    errors.Rubric_Name = "Rubric name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
