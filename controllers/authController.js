const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, name, password, role_id } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role_id,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Account Created Successfully!" });
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

module.exports = {
  login,
  register,
};
