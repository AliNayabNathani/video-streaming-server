const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  deleteUser,
  changeActiveStatus,
  editUserTable,
  UserExportCsv,
  addNewUser,
  addNewCoupon,
  getAllCoupons,
  addCategory,
  addSubCategory,
  updateTermsAndConditions,
  updatePrivacyPolicy,
  updateAboutUs,
  getAllContent,
  addContentCreator,
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
  getAllChannels,
  getSingleChannel,
  getAllVideos,
  getAllCategoryAndSubCategory,
  GetContentApproval,
  rejectContent,
  acceptContent,
  listVideosByContentCreator,
  getAllCategories,
  getAllCategoryAndSubCategoryCsv,
  getAllContentCreatorCsv,
} = require("../controllers/adminController");
const {
  authorizePermission,
  authenticateUser,
} = require("../middleware/authentication");

//get All Users
router.route("/").get(authenticateUser, getAllUsers);

//export user csv
router.route("/export-users-csv").get(UserExportCsv);

//Add New User
router.route("/add-new-user").post(addNewUser);

//Add Coupon
router.route("/add-new-coupon").post(addNewCoupon);

//Get Coupon
router.route("/get-coupons").get(getAllCoupons);

//Add Content Creators
router.route("/add-content-creator").post(addContentCreator);

//Get Content Creators
router.route("/get-content-creator").get(getAllContentCreator);

//Get Content Creators
router.route("/content-creator-csv").get(getAllContentCreatorCsv);

//Add Category
router.route("/add-category").post(addCategory);

//Add Sub Category
router.route("/add-sub-category").post(addSubCategory);

//Content Management Module
router.route("/get-all-content").get(getAllContent);
router.route("/terms-and-conditions").put(updateTermsAndConditions);
router.route("/privacy-policy").put(updatePrivacyPolicy);
router.route("/about-us").put(updateAboutUs);

//Get all sub-categories
router.route("/get-all-category").get(getAllCategories);

//Get all sub-categories
router.route("/get-all-subcategory").get(getSubCategory);

//Get All Channels
router.route("/channels").get(getAllChannels);

//Get Content Approval
router.route("/content-approval").get(GetContentApproval);

//Get All Videos
router.route("/videos").get(getAllVideos);

//Get All Cat and Sub Cat
router.route("/category-management").get(getAllCategoryAndSubCategory);

//Download Csv
router.route("/category-export").get(getAllCategoryAndSubCategoryCsv);

//Get All Channels
router.route("/channel/:id").get(getSingleChannel);

//Get or Delete ContentCreator
router
  .route("/contentcreator/:id")
  .get(getSingleContentCreator)
  .delete(deleteContentCreator);

//Get Content Creator Detail Screen
router.route("/contentcreatordetail/:id").get(listVideosByContentCreator);

//Edit ContentCreator info
router.route("/contentcreator/:id/edit").put(editContentCreatorTable);

//change change status
router.route("/:id/active-channel").put(changeChannelActiveStatus);

//Set Content Creator Status
router
  .route("/:id/active-contentcreator")
  .put(changeContentCreatorActiveStatus);

//Get or Delete Category
router.route("/category/:id").get(getSingleCategory).delete(deleteCategory);

//Edit Category info
router.route("/category/:id/edit").put(editCategoryTable);

//reject content
router.route("/content/:id/reject").post(rejectContent);

//accept
router.route("/content/:id/accept").post(acceptContent);

//change Channel status
// router.route("/channel/:id/active").put(changeChannelActiveStatus);

//Get or Delete Single User
router.route("/:id").get(getSingleUser).delete(deleteUser);

//change user status
router.route("/:id/active").put(changeActiveStatus);

// Edit User Information
router.route("/:id/edit").put(editUserTable);

module.exports = router;
