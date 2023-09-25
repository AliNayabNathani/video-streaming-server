const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  const newUser = await User.create({
    name,
    email,
    password,

  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Account Created Successfully!", newUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({
    where: { email },
    attributes: ["id", "name", "password"],
  });
  console.log("user here", user);
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  res.status(StatusCodes.OK).json({ msg: "Logged In" });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Please provide both old and new passwords' });
  }

  // const user = await User.findByPk(req.user.id);
  const user = await User.findByPk(11);

  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Invalid credentials");

  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ message: 'Password changed successfully' });
};


module.exports = {
  login,
  register,
  updatePassword
};
