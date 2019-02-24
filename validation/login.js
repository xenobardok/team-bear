const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  if (!Validator.isLength(data.email, { min: 9, max: 50 })) {
    errors.email = "Email must be between 9 and 50 characters";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 20 })) {
    errors.password = "Password must be between 6 and 20 characters";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
