const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

const validateSignupData = (email, password, confirmPassword) => {
  let errors = {};

  if (isEmpty(email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(email)) {
    console.log('email wrong');
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(password)) errors.password = 'Must not be empty';
  if (password !== confirmPassword)
    errors.confirmPassword = 'Passwords must match';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const validateLoginData = (email, password) => {
  let errors = {};

  if (isEmpty(email)) errors.email = 'Must not be empty';
  if (isEmpty(password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

module.exports = {
  validateSignupData,
  validateLoginData,
};
