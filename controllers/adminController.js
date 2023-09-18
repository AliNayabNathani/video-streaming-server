const User = require("../models/User");
const Role = require("../models/Role");
const Coupon = require("../models/Coupon");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const ContentCreator = require("../models/ContentCreator");

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
  console.log(requestUser);
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

const addNewCoupon = async (req, res) => {
  const { name, value, desc, max_value, max_redemptions } = req.body;

  const existingCoupon = await Coupon.findOne({ where: { name } });
  if (existingCoupon) {
    throw new CustomError.BadRequestError("Coupon already exists");
  }

  const newCoupon = await Coupon.create({
    name,
    value,
    desc,
    max_value,
    max_redemptions
  });
  res.status(StatusCodes.OK).json({ msg: "Coupon Successfuly Created" });
}

const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.findAll({
    attributes: {
      include: ['name', 'value', 'desc', 'max_value', 'max_redemptions'],
    }
  });
  console.log("Coupons: ", coupons);

  const couponCount = coupons.length;
  res.status(StatusCodes.OK).json({ coupons, count: couponCount });
}

const addCategory = async (req, res) => {
  const { name, desc } = req.body;
  console.log(name, desc);

  const existingCategory = await Category.findOne({ where: { name } });
  if (existingCategory) {
    throw new CustomError.BadRequestError("Category already exists");
  }

  const newCategory = await Category.create({
    name,
    desc
  });

  res.status(StatusCodes.OK).json({ msg: "Category Added Successfully" });
}

const addSubCategory = async (req, res) => {
  const { name, category_id, desc } = req.body;

  const categoryId = await Category.findOne({ where: { id: category_id } })

  console.log("Category ID: ", categoryId);

  if (!categoryId) {
    throw new CustomError.NotFoundError(
      "Category doesn't exist"
    );
  }
  const existingSubCategory = await SubCategory.findOne({ where: { name } });
  if (existingSubCategory) {
    throw new CustomError.BadRequestError(
      "Category already exist"
    );
  }
  const newSubCategory = await SubCategory.create({
    name,
    category_id,
    desc
  });

  res.status(StatusCodes.OK).json({ msg: "Sub Category Added Successfully" });
}

const getAllContentCreator = async (req, res) => {
  const creators = await ContentCreator.findAll();
  const userCount = creators.length;

  res.status(StatusCodes.OK).json({ creators, count: userCount });
};

const addContentCreator = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  console.log(existingUser.id);

  if (!existingUser) {
    const newUser = User.create({
      name,
      email,
      password,
    });

    const newUserId = newUser.id;
    const newContentCreator = ContentCreator.create({
      newUserId,
      name
    })
  }

  const newContentCreator = ContentCreator.create({
    name
  })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  changeActiveStatus,
  editUserTable,
  exportCsv,
  addNewUser,
  addNewCoupon,
  getAllCoupons,
  addCategory,
  addSubCategory,
  addContentCreator
};
