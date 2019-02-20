const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data){

    let errors = {};

    if(!Validator.isLength(data.firstname, {min: 2, max: 20})){
        errors.firstname = "Firstname must be between 1 and 30 characters";
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}