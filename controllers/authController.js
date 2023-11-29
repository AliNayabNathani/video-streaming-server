const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const device = require("device");
const userAgentParser = require("ua-parser-js");
const ipinfo = require("ipinfo");

const userDevices = {};
const loginHistory = [];

const register = async (req, res) => {
  const { email, name, password, role_id, mobile_number, gender } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role_id,
    mobile_number,
    gender,
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
    attributes: ["id", "name", "password", "email", "role_id"],
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError("User Doesnot Exist!");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser, msg: "Logged In" });
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({
    where: { email },
    attributes: ["id", "name", "password", "email", "role_id"],
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError("User Doesnot Exist!");
  }

  // Check if the user has the required role (Admin with roleId = 1)
  if (user.role_id !== "1") {
    throw new CustomError.UnauthorizedError(
      "You do not have the required permissions to log in"
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser, msg: "Logged In" });
};

const contentCreatorLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({
    where: { email },
    attributes: ["id", "name", "password", "email", "role_id"],
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  // Check if the user has the required role (Admin with roleId = 1)
  if (user.role_id !== "4") {
    throw new CustomError.UnauthorizedError(
      "You do not have the required permissions to log in"
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser, msg: "Logged In" });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({
    where: { email },
    attributes: ["id", "name", "password", "email", "role_id"],
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  // Check if the user has the required role (User with roleId = 2)
  if (user.role_id !== "2") {
    throw new CustomError.UnauthorizedError(
      "You do not have the required permissions to log in"
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser, msg: "Logged In" });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Logged Out." });
};

const updatePassword = async (req, res) => {
  const userId = req.user.userId;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Please provide both old and new passwords" });
  }

  // const user = await User.findByPk(req.user.id);
  const user = await User.findByPk(userId);

  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Invalid credentials");
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ message: "Password changed successfully" });
};

const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { name, email, mobile_number } = req.body;
  console.log(req.body);

  const user = await User.findByPk(userId);
  console.log("FOUND", user);
  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
  }

  if (mobile_number) {
    user.mobile_number = mobile_number;
  }

  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.OK)
    .json({ user: tokenUser, message: "Profile updated successfully." });
};

module.exports = {
  login,
  adminLogin,
  contentCreatorLogin,
  userLogin,
  register,
  updatePassword,
  updateProfile,
  logout,
};
