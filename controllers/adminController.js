const User = require("../models/User");
const Role = require("../models/Role");
const json2csv = require("json2csv");
const fs = require("fs").promises;
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  const userCount = users.length;

  // for (const user of users) {
  //   const role = await Role.findByPk(user.role_id);
  //   const isAssociated = role !== null;

  //   console.log(`User ${user.name}'s Role ID: ${user.role_id}`);
  //   console.log(`Is Role ID Associated with a Role: ${isAssociated}`);
  // }

  res.status(StatusCodes.OK).json({ users, count: userCount });
};

const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  console.log("req user", req.user);

  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id ${userId}`);
  }

  //Uncomment after permissions set
  checkPermissions(req.user, user.id);

  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const userIdToDelete = req.params.id;
  console.log(userIdToDelete);
  const { user: requestUser } = req;

  const userToDelete = await User.findByPk(userIdToDelete);
  if (!userToDelete) {
    throw new CustomError.NotFoundError(`No user with id ${userIdToDelete}`);
  }

  const adminRole = await Role.findOne({ where: { name: "Admin" } });

  if (
    adminRole &&
    userToDelete.role_id === adminRole.id &&
    userToDelete.id !== requestUser.id
  ) {
    throw new CustomError.UnauthorizedError(
      "Admins cannot be deleted by other users"
    );
  }
  // Delete the user
  await userToDelete.destroy();
  const user = await res
    .status(StatusCodes.OK)
    .json({ msg: "User Deleted Successfully!" });
};

const changeActiveStatus = async (req, res) => {
  const { id: userIdToChange } = req.params;
  const { user: requestUser } = req;

  const userToChange = await User.findByPk(userIdToChange);

  if (!userToChange) {
    throw new CustomError.NotFoundError(
      `No user found with id ${userIdToChange}`
    );
  }

  checkPermissions(requestUser, userToChange.id);

  userToChange.status =
    userToChange.status === "Active" ? "InActive" : "Active";
  await userToChange.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Status Changed", user: userToChange });
};

const editUserTable = async (req, res) => {
  const { id: userIdToEdit } = req.params;
  const { user: requestUser } = req;

  checkPermissions(requestUser, userIdToEdit);

  const { name, gender, mobileNumber } = req.body;

  const userToEdit = await User.findByPk(userIdToEdit);

  if (!userToEdit) {
    throw new CustomError.NotFoundError(
      `No user found with id ${userIdToEdit}`
    );
  }

  userToEdit.name = name;
  userToEdit.gender = gender;
  userToEdit.mobileNumber = mobileNumber;

  await userToEdit.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "User information updated", user: userToEdit });
};

const exportCsv = async (req, res) => {
  const { user: requestUser } = req;
  checkPermissions(requestUser);

  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  if (!users) {
    throw new CustomError.NotFoundError("No users found");
  }
  const fields = Object.keys(User.tableAttributes);

  const csv = json2csv.parse(users, { fields });

  const timestamp = new Date().toISOString().replace(/:/g, "-");

  res.setHeader(
    "Content-disposition",
    `attachment; filename=users_${timestamp}.csv`
  );
  res.set("Content-Type", "text/csv");

  res.status(200).send(csv);
};

const addNewUser = async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new CustomError.BadRequestError("User already exists");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  res.status(StatusCodes.CREATED).json({ msg: "User Created Successfully!" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  changeActiveStatus,
  editUserTable,
  exportCsv,
  addNewUser,
};
