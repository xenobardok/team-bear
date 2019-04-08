const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRubricInput(arrays) {
  let errors = {};

  // console.log(arrays);
  let sum = 0;
  arrays.forEach(row => {
    let weight = row.Rubric_Row_Weight;
    if (weight < 0 && weight > 100) {
      errors.weight = "Weight must be between 0 - 100";
    } else {
      sum += parseFloat(weight);
    }

    if (!Validator.isFloat(weight)) {
      errors.weight = "Weight must be a number.";
    }

    if (isEmpty(weight)) {
      errors.weight = "Weight cannot be empty.";
    }
  });

  if (sum != 100) {
    errors.weight = "Sum of weight must be 100.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
