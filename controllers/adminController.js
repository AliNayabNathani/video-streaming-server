const User = require("../models/User");
const Role = require("../models/Role");
const ContentCreator = require("../models/ContentCreator");
const Channel = require("../models/Channel");
const Episodes = require("../models/Episodes");
const Trailer = require("../models/Trailer");
const Coupon = require("../models/Coupon");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const ContentManagement = require("../models/ContentManagement");
const json2csv = require("json2csv");
// const json2csv = require("json2csv").Parser;
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");
const { STATUS_CODES } = require("http");
const Video = require("../models/Video");
const ContentApproval = require("../models/ContentApproval");
const Episode = require("../models/Episodes");
const ViewsStats = require("../models/Stats");
const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");
const { Op } = require("sequelize");

const getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  const userCount = users.length;

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

  // checkPermissions(requestUser, userToChange.id);

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

const UserExportCsv = async (req, res) => {
  const { user: requestUser } = req;
  // checkPermissions(requestUser);

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

  if ((!name, !value)) {
    throw new CustomError.BadRequestError("Please Fill Required Fields.");
  }

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

const deleteCoupon = async (req, res) => {
  const couponName = req.params.id;

  const existingCoupon = await Coupon.findByPk(couponName);

  if (!existingCoupon) {
    throw new CustomError.NotFoundError("Coupon not found");
  }

  await existingCoupon.destroy();

  res.status(StatusCodes.OK).json({ msg: "Coupon successfully deleted" });
};

const changeCouponStatus = async (req, res) => {
  const couponName = req.params.id;

  const couponToChange = await Coupon.findByPk(couponName);

  if (!couponToChange) {
    throw new CustomError.NotFoundError(
      `No Coupon found with name ${couponName}`
    );
  }

  // checkPermissions(requestUser, userToChange.id);

  couponToChange.status =
    couponToChange.status === "Active" ? "InActive" : "Active";
  await couponToChange.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Status Changed", coupon: couponToChange });
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

  res
    .status(StatusCodes.OK)
    .json({ newCategory, msg: "Category Added Successfully" });
};

const addSubCategory = async (req, res) => {
  const { name, category_id, desc } = req.body;

  const categoryId = await Category.findOne({ where: { id: category_id } });

  console.log("Category ID: ", categoryId);

  if (!categoryId) {
    throw new CustomError.NotFoundError("Category doesn't exist");
  }
  const existingSubCategory = await SubCategory.findOne({
    where: { name, category_id },
  });

  if (existingSubCategory) {
    throw new CustomError.BadRequestError("Sub Category already exist");
  }
  const newSubCategory = await SubCategory.create({
    name,
    category_id,
    desc,
  });

  res.status(StatusCodes.OK).json({ msg: "Sub Category Added Successfully" });
};

const getAllContentCreator = async (req, res) => {
  const creators = await ContentCreator.findAll({});

  const creatorData = await Promise.all(
    creators.map(async (creator) => {
      const user = await User.findByPk(creator.user_id, {
        // attributes: ["gender"],
      });

      const genderValue = user && user.gender ? user.gender : "-";

      return {
        id: creator.id,
        name: creator.name,
        total_videos: creator.total_videos,
        subscribers: creator.subscribers,
        status: creator.status,
        gender: genderValue,
      };
    })
  );

  const creatorCount = creators.length;

  res
    .status(StatusCodes.OK)
    .json({ creators: creatorData, count: creatorCount });
};

const getAllContentCreatorCsv = async (req, res) => {
  const creators = await ContentCreator.findAll({});
  const creatorData = await Promise.all(
    creators.map(async (creator) => {
      const user = await User.findByPk(creator.user_id, {
        attributes: ["gender"],
      });

      return {
        id: creator.id,
        name: creator.name,
        total_videos: creator.total_videos,
        subscribers: creator.subscribers,
        status: creator.status,
        gender: user ? user.gender : null,
      };
    })
  );

  const creatorCount = creators.length;

  const fields = [
    "id",
    "name",
    "total_videos",
    "subscribers",
    "status",
    "email",
  ];

  const csv = json2csv.parse(creatorData, { fields });

  res.setHeader(
    "Content-disposition",
    `attachment; filename=content_creators.csv`
  );
  res.set("Content-Type", "text/csv");

  res.status(StatusCodes.OK).send(csv);
};

const addContentCreator = async (req, res) => {
  const { name, gender, mobile_number } = req.body;
  const existingUser = await User.findOne({ where: { mobile_number, name } });

  if (!existingUser) {
    throw new CustomError.NotFoundError("User Not Found. Create User First");
  }

  const existingContentCreator = await ContentCreator.findOne({
    where: { name, user_id: existingUser.id },
  });

  if (existingContentCreator) {
    throw new CustomError.BadRequestError(
      "Content Creator with this name already exists."
    );
  }

  const contentCreator = await ContentCreator.create({
    name,
    user_id: existingUser.id,
  });

  existingUser.role_id = 4;

  await existingUser.save();

  res
    .status(StatusCodes.CREATED)
    .json({ contentCreator, msg: "Content Creator Added." });
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

  res
    .status(StatusCodes.OK)
    .json({ msg: "Content Creator Deleted Successfully." });
};

const listVideosByContentCreator = async (req, res) => {
  const { id: userId } = req.params;

  const contentCreator = await ContentCreator.findOne({
    where: { id: userId },
    include: [
      {
        association: "channels",
        attributes: ["id", "name", "content_creator_id"],
        include: [
          {
            association: "videos",
            attributes: ["id", "name", "views"],
          },
        ],
      },
    ],
  });

  if (!contentCreator) {
    throw new CustomError.NotFoundError("Content creator not found.");
  }

  const videos = [];
  contentCreator.channels.forEach((channel) => {
    channel.videos.forEach((video) => {
      videos.push({
        id: video.id,
        name: video.name,
        views: video.views,
      });
    });
  });

  const videosCount = videos.length;

  res.status(StatusCodes.OK).json({ videos, videosCount });
};

const updateTermsAndConditions = async (req, res) => {
  const { updatedDescription } = req.body;

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

const getSubCategory = async (req, res) => {
  const subCategory = await SubCategory.findAll({});
  const subCategoryCount = subCategory.length;

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
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new CustomError.NotFoundError(`No category with id ${categoryId}`);
  }

  //Uncomment after permissions set
  // checkPermissions(req.category, category.id);

  res.status(StatusCodes.OK).json({ category });
};

const editContentCreatorTable = async (req, res) => {
  const { id: ContentCreatorIdToEdit } = req.params;
  const { ContentCreator: requestContentCreator } = req;

  // checkPermissions(, );

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

  res.status(StatusCodes.OK).json({
    msg: "Content Creator information updated",
    ContentCreator: ContentCreatorToEdit,
  });
};

const changeContentCreatorActiveStatus = async (req, res) => {
  const { id: contentCreatorIdToChange } = req.params;
  // const { ContentCreator: requestContentCreator } = req;
  console.log("ID IN PARAMS", contentCreatorIdToChange);
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
  const { id: channelIdToChange } = req.params;
  // const { user: requestUser } = req;

  const channelToChange = await Channel.findByPk(channelIdToChange);

  if (!channelToChange) {
    throw new CustomError.NotFoundError(
      `No Channel found with id ${channelIdToChange}`
    );
  }

  channelToChange.status =
    channelToChange.status === "Active" ? "InActive" : "Active";
  await channelToChange.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Status Changed", channel: channelToChange });
};

const getAllChannels = async (req, res) => {
  const channels = await Channel.findAll({
    raw: true,
    attributes: ["id", "name", "content_creator_id", "createdAt", "status"],
  });

  if (!channels || channels.length === 0) {
    throw new CustomError.NotFoundError(`No Channel found!!`);
  }

  const creatorIds = channels.map((channel) => channel.content_creator_id);

  const contentCreators = await ContentCreator.findAll({
    where: { id: creatorIds },
    attributes: ["id", "name"],
  });

  const creatorMap = contentCreators.reduce((map, creator) => {
    map[creator.id] = creator.name;
    return map;
  }, {});

  channels.forEach((channel) => {
    channel.creator_name = creatorMap[channel.content_creator_id];
  });

  const channelCount = channels.length;
  res.status(StatusCodes.OK).json({ channels, channelCount });
};

const getSingleChannel = async (req, res) => {
  const channelId = req.params.id;

  const channel = await Channel.findByPk(channelId, {
    include: [
      {
        model: Video,
        as: "videos",
        include: [
          { model: Episodes, as: "episodes" },
          { model: Trailer, as: "trailers" },
        ],
      },
    ],
  });

  if (!channel) {
    throw new CustomError.NotFoundError(`No channel with id ${channelId}`);
  }

  const countVideos = channel.videos.length;

  res.status(StatusCodes.OK).json({ channel, countVideos });
};

const getAllVideos = async (req, res) => {
  const videos = await Video.findAll({
    raw: true,
    attributes: [
      "id",
      "name",
      "views",
      "rented_amount",
      "purchasing_amount",
      "views",
      "createdAt",
      "channelId",
    ],
  });

  if (!videos || videos.length === 0) {
    throw new CustomError.NotFoundError(`No Videos Found!`);
  }

  const videoIds = videos.map((video) => video.id);

  const contentApprovals = await ContentApproval.findAll({
    where: { video_id: videoIds },
    raw: true,
  });

  const videoStatusMap = {};
  contentApprovals.forEach((approval) => {
    videoStatusMap[approval.video_id] = approval.status;
  });

  videos.forEach((video) => {
    video.status = videoStatusMap[video.id] || "Pending";
  });

  const channelIds = videos.map((video) => video.channelId);

  const channels = await Channel.findAll({
    where: { id: channelIds },
    raw: true,
    attributes: ["id", "content_creator_id"],
  });

  const creatorIds = channels.map((channel) => channel.content_creator_id);

  const contentCreators = await ContentCreator.findAll({
    where: { id: creatorIds },
    raw: true,
    attributes: ["id", "name"],
  });

  const creatorMap = contentCreators.reduce((map, creator) => {
    map[creator.id] = creator.name;
    return map;
  }, {});

  videos.forEach((video) => {
    const channel = channels.find((channel) => channel.id === video.channelId);
    if (channel) {
      video.creator_name = creatorMap[channel.content_creator_id];
    }
  });

  const videosCount = videos.length;
  res.status(StatusCodes.OK).json({ videos, videosCount });
};

const getAllactiveinactiveVideos = async (req, res) => {
  const videos = await Video.findAll({
    raw: true,
    where: {
      status: {
        [Op.in]: ["Active", "InActive"],
      },
    },
    attributes: [
      "id",
      "name",
      "views",
      "rented_amount",
      "purchasing_amount",
      "views",
      "status",
      "createdAt",
      "channelId",
    ],
  });

  if (!videos || videos.length === 0) {
    throw new CustomError.NotFoundError(`No Active or InActive Videos found!!`);
  }

  const videoIds = videos.map((video) => video.id);

  const contentApprovals = await ContentApproval.findAll({
    where: { video_id: videoIds },
    raw: true,
  });

  const videoStatusMap = {};
  contentApprovals.forEach((approval) => {
    videoStatusMap[approval.video_id] = approval.status;
  });

  videos.forEach((video) => {
    video.status = videoStatusMap[video.id] || "Pending";
  });

  const channelIds = videos.map((video) => video.channelId);

  const channels = await Channel.findAll({
    where: { id: channelIds },
    raw: true,
    attributes: ["id", "content_creator_id"],
  });

  const creatorIds = channels.map((channel) => channel.content_creator_id);

  const contentCreators = await ContentCreator.findAll({
    where: { id: creatorIds },
    raw: true,
    attributes: ["id", "name"],
  });

  const creatorMap = contentCreators.reduce((map, creator) => {
    map[creator.id] = creator.name;
    return map;
  }, {});

  videos.forEach((video) => {
    const channel = channels.find((channel) => channel.id === video.channelId);
    if (channel) {
      video.creator_name = creatorMap[channel.content_creator_id];
    }
  });

  const videosCount = videos.length;
  res.status(StatusCodes.OK).json({ videos, videosCount });
};

const getAllActiveVideos = async (req, res) => {
  const videos = await Video.findAll({
    raw: true,
    where: {
      status: "Active",
    },
    attributes: [
      "id",
      "name",
      "views",
      "rented_amount",
      "purchasing_amount",
      "views",
      "createdAt",
      "channelId",
    ],
  });

  if (!videos || videos.length === 0) {
    throw new CustomError.NotFoundError(`No Active Videos Found!`);
  }

  const videoIds = videos.map((video) => video.id);

  const contentApprovals = await ContentApproval.findAll({
    where: { video_id: videoIds },
    raw: true,
  });

  const videoStatusMap = {};
  contentApprovals.forEach((approval) => {
    videoStatusMap[approval.video_id] = approval.status;
  });

  videos.forEach((video) => {
    video.status = videoStatusMap[video.id] || "Pending";
  });

  const channelIds = videos.map((video) => video.channelId);

  const channels = await Channel.findAll({
    where: { id: channelIds },
    raw: true,
    attributes: ["id", "content_creator_id"],
  });

  const creatorIds = channels.map((channel) => channel.content_creator_id);

  const contentCreators = await ContentCreator.findAll({
    where: { id: creatorIds },
    raw: true,
    attributes: ["id", "name"],
  });

  const creatorMap = contentCreators.reduce((map, creator) => {
    map[creator.id] = creator.name;
    return map;
  }, {});

  videos.forEach((video) => {
    const channel = channels.find((channel) => channel.id === video.channelId);
    if (channel) {
      video.creator_name = creatorMap[channel.content_creator_id];
    }
  });

  const videosCount = videos.length;
  res.status(StatusCodes.OK).json({ videos, videosCount });
};

const getAllPendingVideos = async (req, res) => {
  const videos = await Video.findAll({
    raw: true,
    where: {
      status: "Pending",
    },
    attributes: [
      "id",
      "name",
      "views",
      "rented_amount",
      "purchasing_amount",
      "views",
      "createdAt",
      "channelId",
    ],
  });

  if (!videos || videos.length === 0) {
    throw new CustomError.NotFoundError(`No Pending Videos Found!`);
  }

  const videoIds = videos.map((video) => video.id);

  const contentApprovals = await ContentApproval.findAll({
    where: { video_id: videoIds },
    raw: true,
  });

  const videoStatusMap = {};
  contentApprovals.forEach((approval) => {
    videoStatusMap[approval.video_id] = approval.status;
  });

  videos.forEach((video) => {
    video.status = videoStatusMap[video.id] || "Pending";
  });

  const channelIds = videos.map((video) => video.channelId);

  const channels = await Channel.findAll({
    where: { id: channelIds },
    raw: true,
    attributes: ["id", "content_creator_id"],
  });

  const creatorIds = channels.map((channel) => channel.content_creator_id);

  const contentCreators = await ContentCreator.findAll({
    where: { id: creatorIds },
    raw: true,
    attributes: ["id", "name"],
  });

  const creatorMap = contentCreators.reduce((map, creator) => {
    map[creator.id] = creator.name;
    return map;
  }, {});

  videos.forEach((video) => {
    const channel = channels.find((channel) => channel.id === video.channelId);
    if (channel) {
      video.creator_name = creatorMap[channel.content_creator_id];
    }
  });

  const videosCount = videos.length;
  res.status(StatusCodes.OK).json({ videos, videosCount });
};

const getAnyVideoByStatus = async (req, res) => {
  let whereClause = {};

  if (req.query.status) {
    const statusValues = Array.isArray(req.query.status)
      ? req.query.status
      : [req.query.status];

    const allowedStatusValues = ["Active", "InActive", "Pending"];
    const isValidStatus = statusValues.every((status) =>
      allowedStatusValues.includes(status)
    );

    if (isValidStatus) {
      whereClause = { status: { [Op.in]: statusValues } };
    } else {
      throw new CustomError.BadRequestError(`Invalid status value(s)`);
    }
  }

  const videos = await Video.findAll({
    raw: true,
    where: whereClause,
    attributes: [
      "id",
      "name",
      "views",
      "rented_amount",
      "purchasing_amount",
      "views",
      "createdAt",
      "channelId",
      "status",
    ],
  });

  if (!videos || videos.length === 0) {
    throw new CustomError.NotFoundError(`No Videos Found!`);
  }

  const videoIds = videos.map((video) => video.id);

  // const contentApprovals = await ContentApproval.findAll({
  //   where: { video_id: videoIds },
  //   raw: true,
  // });

  // const videoStatusMap = {};
  // contentApprovals.forEach((approval) => {
  //   videoStatusMap[approval.video_id] = approval.status;
  // });

  // videos.forEach((video) => {
  //   video.status = videoStatusMap[video.id] || "Pending";
  // });

  const channelIds = videos.map((video) => video.channelId);

  const channels = await Channel.findAll({
    where: { id: channelIds },
    raw: true,
    attributes: ["id", "content_creator_id"],
  });

  const creatorIds = channels.map((channel) => channel.content_creator_id);

  const contentCreators = await ContentCreator.findAll({
    where: { id: creatorIds },
    raw: true,
    attributes: ["id", "name"],
  });

  const creatorMap = contentCreators.reduce((map, creator) => {
    map[creator.id] = creator.name;
    return map;
  }, {});

  videos.forEach((video) => {
    const channel = channels.find((channel) => channel.id === video.channelId);
    if (channel) {
      video.creator_name = creatorMap[channel.content_creator_id];
    }
  });

  const videosCount = videos.length;
  res.status(StatusCodes.OK).json({ videos, videosCount });
};

const getSingleVideo = async (req, res) => {
  const videoId = req.params.id;

  const video = await Video.findByPk(videoId, {
    include: [
      { model: Episodes, as: "episodes" },
      { model: Trailer, as: "trailers" },
    ],
  });

  if (!video) {
    throw new CustomError.NotFoundError(`No video with id ${videoId}`);
  }

  res.status(200).json({ video });
};

const deleteSingleVideo = async (req, res) => {
  const videoId = req.params.id;

  const video = await Video.findByPk(videoId);

  if (!video) {
    throw new CustomError.NotFoundError(`No video with id ${videoId}`);
  }

  await Episode.destroy({ where: { videoId } });
  await Trailer.destroy({ where: { videoId } });
  await ViewsStats.destroy({ where: { video_id: videoId } });
  await Subscription.destroy({ where: { video_id: videoId } });
  await Payment.destroy({ where: { video_id: videoId } });
  await ContentApproval.destroy({ where: { video_id: videoId } });
  await Video.destroy({ where: { id: videoId } });

  res.status(200).json({ message: "Video deleted successfully" });
};

const rejectContent = async (req, res) => {
  const contentId = req.params.id;
  const userId = req.user.userId;

  const content = await Video.findByPk(contentId);

  if (!content) {
    throw new CustomError.NotFoundError("Content Not Found!!");
  }
  await content.update({ status: "Rejected" });
  const contentapproval = await ContentApproval.create({
    user_id: userId,
    video_id: contentId,
    status: "Reject",
  });

  res
    .status(StatusCodes.OK)
    .json({ contentapproval, msg: "Content Rejected!!" });
};

const acceptContent = async (req, res) => {
  const contentId = req.params.id;
  // console.log("CONTENT", contentId);
  const userId = req.user;
  // console.log("Me user: ", userId);
  const content = await Video.findOne({
    where: { id: contentId },
  });
  console.log("CONTENT BEFORE", content);

  if (!content) {
    throw new CustomError.NotFoundError("Content Not Found!!");
  }
  await content.update({ status: "Active" });
  console.log("CONTENT AFTER", content);
  const contentapproval = await ContentApproval.create({
    user_id: userId.userId,
    video_id: contentId,
    status: "Accept",
  });

  res
    .status(StatusCodes.OK)
    .json({ contentapproval, msg: "Content Accepted!!" });
};

const changeVideoStatus = async (req, res) => {
  const { id: videoIdToChange } = req.params;
  // console.log("videoId", videoIdToChange);

  const videoToChange = await Video.findByPk(videoIdToChange);
  // console.log("VIDEO TO CHANGE", videoToChange);
  if (!videoToChange) {
    throw new CustomError.NotFoundError(
      `No Video found with id ${videoIdToChange}`
    );
  }

  videoToChange.status =
    videoToChange.status === "Active" ? "InActive" : "Active";

  await videoToChange.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Status Changed", video: videoToChange });
};

const getAllCategories = async (req, res, next) => {
  const categories = await Category.findAll({
    raw: true,
    attributes: ["name"],
  });

  if (!categories || categories.length === 0) {
    throw new CustomError.NotFoundError(`No Categories found!!`);
  }

  const categoriesCount = categories.length;

  res.status(StatusCodes.OK).json({ categories, categoriesCount });
};

const getAllCategoryAndSubCategory = async (req, res) => {
  const categories = await Category.findAll({
    raw: true,
    attributes: ["id", "name"],
  });

  if (!categories || categories.length === 0) {
    throw new CustomError.NotFoundError(`No Categories found!!`);
  }

  const subcategories = await SubCategory.findAll({
    raw: true,
    attributes: ["id", "name", "category_id", "desc"],
  });

  // Organize subcategories into categories
  const categoriesWithSubcategories = categories.map((category) => {
    category.subcategories = subcategories.filter(
      (subcategory) => subcategory.category_id === category.id
    );
    return category;
  });

  res.status(StatusCodes.OK).json({ categories: categoriesWithSubcategories });
};

const getAllCategoryAndSubCategoryCsv = async (req, res) => {
  const categories = await Category.findAll({
    raw: true,
    attributes: ["id", "name"],
  });

  if (!categories || categories.length === 0) {
    throw new CustomError.NotFoundError(`No Categories found!!`);
  }

  const subcategories = await SubCategory.findAll({
    raw: true,
    attributes: ["id", "name", "category_id", "desc"],
  });

  const csvData = [];
  categories.forEach((category) => {
    subcategories
      .filter((subcategory) => subcategory.category_id === category.id)
      .forEach((subcategory) => {
        csvData.push({
          "Category ID": category.id,
          "Category Name": category.name,
          "Subcategory ID": subcategory.id,
          "Subcategory Name": subcategory.name,
          Description: subcategory.desc,
        });
      });
  });

  const fields = [
    "Category ID",
    "Category Name",
    "Subcategory ID",
    "Subcategory Name",
    "Description",
  ];

  const csv = json2csv.parse(csvData, { fields });

  res.setHeader(
    "Content-disposition",
    `attachment; filename=categories_and_subcategories.csv`
  );
  res.set("Content-Type", "text/csv");

  res.status(200).send(csv);
};

const GetContentApproval = async (req, res, next) => {
  const videos = await Video.findAll({
    raw: true,
    attributes: [
      "id",
      "name",
      "rented_amount",
      "purchasing_amount",
      "createdAt",
      "channelId",
    ],
  });

  if (!videos || videos.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `No Videos found!!` });
  }

  const videoIds = videos.map((video) => video.id);

  const contentApprovals = await ContentApproval.findAll({
    where: { video_id: videoIds },
    raw: true,
  });

  const videoStatusMap = {};
  contentApprovals.forEach((approval) => {
    videoStatusMap[approval.video_id] = approval.status;
  });

  videos.forEach((video) => {
    video.status = videoStatusMap[video.id] || "Pending";
  });

  const channelIds = videos.map((video) => video.channelId);

  const channels = await Channel.findAll({
    where: { id: channelIds },
    raw: true,
    attributes: ["id", "content_creator_id"],
  });

  const creatorIds = channels.map((channel) => channel.content_creator_id);

  const contentCreators = await ContentCreator.findAll({
    where: { id: creatorIds },
    raw: true,
    attributes: ["id", "name"],
  });

  const creatorMap = contentCreators.reduce((map, creator) => {
    map[creator.id] = creator.name;
    return map;
  }, {});

  videos.forEach((video) => {
    const channel = channels.find((channel) => channel.id === video.channelId);
    if (channel) {
      video.creator_name = creatorMap[channel.content_creator_id];
    }
  });

  const videosCount = videos.length;
  res.status(StatusCodes.OK).json({ videos, videosCount });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  changeActiveStatus,
  changeVideoStatus,
  editUserTable,
  UserExportCsv,
  addNewUser,
  addNewCoupon,
  getAllCoupons,
  deleteCoupon,
  changeCouponStatus,
  addCategory,
  addSubCategory,
  getAllCategories,
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
  listVideosByContentCreator,
  editContentCreatorTable,
  changeContentCreatorActiveStatus,
  changeChannelActiveStatus,
  getAllChannels,
  getSingleChannel,
  getAllVideos,
  getAllActiveVideos,
  getAllPendingVideos,
  getAnyVideoByStatus,
  getAllactiveinactiveVideos,
  getAllCategoryAndSubCategory,
  getAllCategoryAndSubCategoryCsv,
  GetContentApproval,
  rejectContent,
  getAllContentCreatorCsv,
  acceptContent,
  getSingleVideo,
  deleteSingleVideo,
};
