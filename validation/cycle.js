const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateCycleInput(data) {
  let errors = {};

  if (!Validator.isLength(data.Cycle_Name, { min: 2, max: 50 })) {
    errors.Cycle_Name = "Cycle name cannot be empty";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
