const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};// Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";// Name checks
  data.mobileNo = !isEmpty(data.mobileNo) ? data.mobileNo : "";
  data.position = !isEmpty(data.position) ? data.position : "";
  data.mentortype = !isEmpty(data.mentortype) ? data.mentortype : "";
  data.medicalcollege = !isEmpty(data.medicalcollege) ? data.medicalcollege : "";
  data.session = !isEmpty(data.session) ? data.session : "";
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }// Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  if (Validator.isEmpty(data.mobileNo)) {
    errors.mobileNo = "Mobile number field is required";
  }
  if (!/^[+]*[0-9]+$/.test(data.mobileNo)) {
    errors.mobileNo = "Mobile number is invalid";
  }
  if (Validator.isEmpty(data.mentortype)) {
    errors.mentortype = "Mentor Type field is required";
  }
  if (Validator.isEmpty(data.session)) {
    errors.session = "Session field is required";
  }
  if (Validator.isEmpty(data.medicalcollege)) {
    errors.medicalcollege = "Medical College field is required";
  }
  if (Validator.isEmpty(data.position)) {
    errors.position = "Position field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};