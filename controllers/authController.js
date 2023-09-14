const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
// const { attachCookiesToResponse, createTokenUser } = require("../utils");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  res.status(StatusCodes.OK).json({ email, password });
};

const register = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !password || !name) {
    throw new CustomError.BadRequestError("Please provide all fields");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new CustomError.BadRequestError("Email is already registered");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    status: "Active",
    created_at: new Date(),
    updated_at: new Date(),
  });

  // Respond with the newly created user
  res.status(StatusCodes.CREATED).json(newUser);
};

// const register = async (req, res) => {
//     const { email, name, password } = req.body;

//     const emailAlreadyExists = await User.findOne({ email });
//     if (emailAlreadyExists) {
//         throw new CustomError.BadRequestError('Email already exist')
//     }
//     const isFirstAccount = await User.countDocuments({}) === 0;
//     const role = isFirstAccount ? 'admin' : 'user';

//     const user = await User.create({ name, email, password, role });
//     const tokenUser = createTokenUser(user);

//     attachCookiesToResponse({ res, user: tokenUser });

//     res.status(StatusCodes.CREATED).json({ user: tokenUser })
// }

// const login = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         throw new CustomError.BadRequestError('Please provide email and password');
//     }
//     const user = await User.findOne({ email });

//     if (!user) {
//         throw new CustomError.UnauthenticatedError('Invalid Credentials');
//     }
//     const isPasswordCorrect = await user.comparePassword(password);
//     if (!isPasswordCorrect) {
//         throw new CustomError.UnauthenticatedError('Invalid Credentials');
//     }
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({ res, user: tokenUser });

//     res.status(StatusCodes.OK).json({ user: tokenUser });
// };

// const logout = async (req, res) => {
//     res.cookie('token', 'logout',
//         {
//             httpOnly: true,
//             expires: new Date(Date.now())
//         })
//     res.status(StatusCodes.OK).json({ msg: 'user logged out' })
// }

module.exports = {
  login,
  register,
};
