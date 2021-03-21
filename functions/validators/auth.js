const validateSignupData = (userData) => {
  let errors = [];

  if (userData.password !== userData.confirmPassword) {
    errors.push('Passwords must match');
  }

  return {
    errors,
    valid: errors.length === 0 ? true : false,
  };
};

module.exports = {
  validateSignupData,
};
