const UserModel = require("../../models/user");
const bcrypt = require('bcrypt');
const { registerInput, loginInput } = require("../../utils/validation");
const { UserInputError } = require("apollo-server");
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require("../../config/default");


function generateToken(user) {
  return jwt.sign({
    id: user._id,
    username: user.username,
    email: user.email
  }, SECRET_KEY, { expiresIn: '2h'})
}

module.exports = {
  Mutation: {
    login: async (_, { email, password }) => {

      const { validate, errors } = loginInput(email, password);
      if(!validate) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await UserModel.findOne({ email });
      if(!user) {
        errors.general = 'user not found';
        throw new UserInputError('Errors', { errors })
      }
      const isMatch = bcrypt.compareSync(password, user.password);
      if(!isMatch) {
        errors.general = 'password incorrect';
        throw new UserInputError('Errors', { errors })
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      }

    },
    register: async (_, { registerInput: { username, email, password, confirmPassword } } ) => {

      const { validate, errors } = registerInput(username, email, password, confirmPassword);

      if(!validate) {
        throw new UserInputError("Error", { errors})
      }

      const checkUser = await UserModel.findOne({ email })
      if(checkUser) {
        throw new UserInputError("Error", {
          errors: {
            email: "Email already exists"
          }
        })
      }

      const checkUsername = await UserModel.findOne({ username })
      if(checkUsername) {
        throw new UserInputError("Error", {
          errors: {
            username: "username already exists"
          }
        })
      }

      password = bcrypt.hashSync(password, 10);

      const newUser = await UserModel({
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      })
      const user = await newUser.save();

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token
      }
    }
  }
}