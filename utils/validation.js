module.exports.registerInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {}
  if(username.trim() === "") {
    errors.username = "username must not be empty"
  }
  if(email.trim() === "") {
    errors.email = "email must not be empty"
  }
  if(password.trim() === "") {
    errors.password = "password must not be empty"
  } else if(password !== confirmPassword) {
    errors.confirmPassword = "password and confirm password is mismatch!!!"
  }

  return {
    errors,
    validate: Object.keys(errors).length < 1
  }

}

module.exports.loginInput = (email, password) => {
  const errors = {};

  if(email.trim() === "") {
    errors.email = "email must not be empty"
  }
  if(password.trim() === "") {
    errors.password = "password must not be empty"
  }

  return {
    errors,
    validate: Object.keys(errors).length < 1
  }
}