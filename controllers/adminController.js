const User = require("../models/User");
const Role = require("../models/Role");
const Coupon = require("../models/Coupon");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const ContentCreator = require("../models/ContentCreator");
const ContentManagement = require("../models/ContentManagement");

const Channel = require("../models/Channel");
const json2csv = require("json2csv");
const fs = require("fs").promises;
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");
const { STATUS_CODES } = require("http");

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
  // checkPermissions(req.user, user.id);

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

  // checkPermissions(requestUser, userIdToEdit);
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
    max_redemptions,
  });
  res.status(StatusCodes.OK).json({ msg: "Coupon Successfuly Created" });
};

const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.findAll({
    attributes: {
      include: ["name", "value", "desc", "max_value", "max_redemptions"],
    },
  });
  console.log("Coupons: ", coupons);

  const couponCount = coupons.length;
  res.status(StatusCodes.OK).json({ coupons, count: couponCount });
};

const addCategory = async (req, res) => {
  const { name, desc } = req.body;
  console.log(name, desc);

  const existingCategory = await Category.findOne({ where: { name } });
  if (existingCategory) {
    throw new CustomError.BadRequestError("Category already exists");
  }

  const newCategory = await Category.create({
    name,
    desc,
  });

  res.status(StatusCodes.OK).json({ msg: "Category Added Successfully" });
};

const addSubCategory = async (req, res) => {
  const { name, category_id, desc } = req.body;

  const categoryId = await Category.findOne({ where: { id: category_id } });

  console.log("Category ID: ", categoryId);

  if (!categoryId) {
    throw new CustomError.NotFoundError("Category doesn't exist");
  }
  const existingSubCategory = await SubCategory.findOne({ where: { name } });
  if (existingSubCategory) {
    throw new CustomError.BadRequestError("Category already exist");
  }
  const newSubCategory = await SubCategory.create({
    name,
    category_id,
    desc,
  });

  res.status(StatusCodes.OK).json({ msg: "Sub Category Added Successfully" });
};

//Doesn't work on postman but select * works on postgre
const getAllContentCreator = async (req, res) => {
  const creators = await ContentCreator.findAll({});
  const creatorCount = creators.length;

  res.status(StatusCodes.OK).json({ creators, count: creatorCount });
};

const addContentCreator = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ where: { email } });

  if (!existingUser) {
    const newUser = await User.create({
      name,
      email,
      password,
    });

    const newUserId = newUser.id;
    console.log("ID-----------------------------------:", newUserId);
    const newContentCreator = ContentCreator.create({
      newUserId,
      name,
    });
  }

  const newContentCreator = ContentCreator.create({
    name,
  });
};

const updateTermsAndConditions = async (req, res) => {
  const updatedDescription = req.body.updatedDescription;

  const termsAndConditionsItem = await ContentManagement.findOne({
    where: { name: "Terms And Conditions" },
  });

  if (!termsAndConditionsItem) {
    throw new CustomError.NotFoundError("Terms And Conditions Not Found");
  }

  termsAndConditionsItem.description = updatedDescription;
  await termsAndConditionsItem.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Terms And Conditions Updated Successfully" });
};

const updatePrivacyPolicy = async (req, res) => {
  const updatedDescription = req.body.updatedDescription;

  const privacyPolicyItem = await ContentManagement.findOne({
    where: { name: "Privacy Policy" },
  });

  if (!privacyPolicyItem) {
    throw new CustomError.NotFoundError("Privacy Policy Not Found");
  }

  privacyPolicyItem.description = updatedDescription;
  await privacyPolicyItem.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Privacy Policy Updated Successfully" });
};

const updateAboutUs = async (req, res) => {
  const updatedDescription = req.body.updatedDescription;

  const aboutUsItem = await ContentManagement.findOne({
    where: { name: "About Us" },
  });

  if (!aboutUsItem) {
    throw new CustomError.NotFoundError("About Us Not Found");
  }

  aboutUsItem.description = updatedDescription;
  await aboutUsItem.save();

  res.status(StatusCodes.OK).json({ msg: "About Us Updated Successfully" });
};

const getAllContent = async (req, res) => {
  const termsAndConditionsItem = await ContentManagement.findOne({
    where: { name: "Terms And Conditions" },
  });
  const privacyPolicyItem = await ContentManagement.findOne({
    where: { name: "Privacy Policy" },
  });
  const aboutUsItem = await ContentManagement.findOne({
    where: { name: "About Us" },
  });

  const termsAndConditions = termsAndConditionsItem.description;
  const aboutUs = aboutUsItem.description;
  const privacyPolicy = privacyPolicyItem.description;

  res
    .status(StatusCodes.OK)
    .json({ termsAndConditions, privacyPolicy, aboutUs });
};

const rejectContent = async (req, res) => {
  const contentId = req.params.id;

  const content = await ContentManagement.findByPk(contentId);

  if (!content) {
    throw new CustomError.NotFoundError("Content Creator Not Found");
  }

  await content.destroy();

  res.status(StatusCodes.OK).json({ msg: "Content Rejected!!" });
};

const acceptAndAddToUserChannel = async (req, res) => {
  const contentId = req.params.id;
  const userId = req.body.userId;

  const content = await ContentManagement.findByPk(contentId);
  if (content.channelId) {
    return res
      .status(400)
      .json({ error: "Content is already associated with a channel" });
  }

  const userChannel = await Channel.findOne({ where: { userId } });

  if (!userChannel) {
    throw new CustomError.NotFoundError("User's channel not found");
  }

  // Mark the content as accepted (modify as per your database structure)
  content.accepted = true; // Assuming you have an "accepted" field in your model

  content.channelId = userChannel.id; // Assuming you have a "channelId" field in your ContentManagement model

  await content.save();

  res.status(200).json({
    message: "Content accepted and added to the user's channel successfully",
  });
};

const getSubCategory = async (req, res) => {
  const subCategory = await SubCategory.findAll({});
  const subCategoryCount = subCategory.length;
  console.log("Length: ", subCategoryCount);

  res.status(StatusCodes.OK).json({ subCategory, count: subCategoryCount });
};

const editCategoryTable = async (req, res) => {
  const { id: CategoryIdToEdit } = req.params;
  const { Category: requestCategory } = req;

  // checkPermissions(requestCategory, CategoryIdToEdit);

  const { name, desc } = req.body;

  const CategoryToEdit = await Category.findByPk(CategoryIdToEdit);

  if (!CategoryToEdit) {
    throw new CustomError.NotFoundError(
      `No Category found with id ${CategoryIdToEdit}`
    );
  }

  CategoryToEdit.name = name;
  CategoryToEdit.desc = desc;

  await CategoryToEdit.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Category information updated", Category: CategoryToEdit });
};

const deleteCategory = async (req, res) => {
  const CategoryIdToDelete = req.params.id;
  console.log(CategoryIdToDelete);

  const CategoryToDelete = await Category.findByPk(CategoryIdToDelete);
  if (!CategoryToDelete) {
    throw new CustomError.NotFoundError(
      `No Category with id ${CategoryIdToDelete}`
    );
  }

  // Delete the Category
  await CategoryToDelete.destroy();
  const category = await res
    .status(StatusCodes.OK)
    .json({ msg: "Category Deleted Successfully!" });
};

const getSingleCategory = async (req, res) => {
  const categoryId = req.params.id;
  console.log(categoryId);
  const category = await category.findByPk(categoryId, {});
  if (!category) {
    throw new CustomError.NotFoundError(`No category with id ${categoryId}`);
  }

  //Uncomment after permissions set
  // checkPermissions(req.category, category.id);

  res.status(StatusCodes.OK).json({ category });
};

const getSingleContentCreator = async (req, res) => {
  const contentCreatorId = req.params.id;
  console.log("req contentCreator", req.contentCreator);

  const contentCreator = await ContentCreator.findByPk(contentCreatorId, {});

  if (!contentCreator) {
    throw new CustomError.NotFoundError(
      `No contentCreator with id ${contentCreatorId}`
    );
  }

  //Uncomment after permissions set
  // checkPermissions(req.contentCreator, contentCreator.id);

  res.status(StatusCodes.OK).json({ contentCreator });
};

const deleteContentCreator = async (req, res) => {
  const ContentCreatorIdToDelete = req.params.id;
  console.log(ContentCreatorIdToDelete);

  const ContentCreatorToDelete = await ContentCreator.findByPk(
    ContentCreatorIdToDelete
  );
  if (!ContentCreatorToDelete) {
    throw new CustomError.NotFoundError(
      `No Content Creator with id ${ContentCreatorIdToDelete}`
    );
  }

  // Delete the ContentCreator
  await ContentCreatorToDelete.destroy();
  const ContentCreator = await res
    .status(StatusCodes.OK)
    .json({ msg: "Content Creator Deleted Successfully!" });
};

const editContentCreatorTable = async (req, res) => {
  const { id: ContentCreatorIdToEdit } = req.params;
  const { ContentCreator: requestContentCreator } = req;

  // checkPermissions(requestContentCreator, ContentCreatorIdToEdit);

  const { name } = req.body;

  const ContentCreatorToEdit = await ContentCreator.findByPk(
    ContentCreatorIdToEdit
  );

  if (!ContentCreatorToEdit) {
    throw new CustomError.NotFoundError(
      `No Content Creator found with id ${ContentCreatorIdToEdit}`
    );
  }

  ContentCreatorToEdit.name = name;

  await ContentCreatorToEdit.save();

  res
    .status(StatusCodes.OK)
    .json({
      msg: "Content Creator information updated",
      ContentCreator: ContentCreatorToEdit,
    });
};

const changeContentCreatorActiveStatus = async (req, res) => {
  const { id: contentCreatorIdToChange } = req.params;
  const { ContentCreator: requestContentCreator } = req;

  const contentCreatorToChange = await ContentCreator.findByPk(
    contentCreatorIdToChange
  );

  if (!contentCreatorToChange) {
    throw new CustomError.NotFoundError(
      `No ContentCreator found with id ${contentCreatorIdToChange}`
    );
  }

  // checkPermissions(requestContentCreator, contentCreatorToChange.id);

  contentCreatorToChange.status =
    contentCreatorToChange.status === "Active" ? "InActive" : "Active";
  await contentCreatorToChange.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Status Changed", ContentCreator: contentCreatorToChange });
};

const changeChannelActiveStatus = async (req, res) => {
  const { id: ChannelId } = req.params.id;

  if (!ChannelId) {
    req.status(StatusCodes.NotFoundError).json({ msg: "Channel Not Found" });
  }
  // checkPermissions(requestContentCreator, contentCreatorToChange.id);
  channelToChange = await Channel.finf;
};

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
  addContentCreator,
  updateTermsAndConditions,
  updatePrivacyPolicy,
  updateAboutUs,
  getAllContent,
  getAllContentCreator,
  getSubCategory,
  editCategoryTable,
  deleteCategory,
  getSingleCategory,
  getSingleContentCreator,
  deleteContentCreator,
  editContentCreatorTable,
  changeContentCreatorActiveStatus,
  changeChannelActiveStatus,
};
