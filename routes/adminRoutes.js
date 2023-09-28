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
router
  .route("/")
  .get(authenticateUser, authorizePermission("1", "3"), getAllUsers);

//export user csv
router
  .route("/export-users-csv")
  .get(authenticateUser, authorizePermission("1", "3"), UserExportCsv);

//Add New User
router
  .route("/add-new-user")
  .post(authenticateUser, authorizePermission("1", "3"), addNewUser);

//Add Coupon
router
  .route("/add-new-coupon")
  .post(authenticateUser, authorizePermission("1", "3"), addNewCoupon);

//Get Coupon
router
  .route("/get-coupons")
  .get(authenticateUser, authorizePermission("1", "3"), getAllCoupons);

//Add Content Creators
router
  .route("/add-content-creator")
  .post(authenticateUser, authorizePermission("1", "3"), addContentCreator);

//Get Content Creators
router
  .route("/get-content-creator")
  .get(authenticateUser, authorizePermission("1", "3"), getAllContentCreator);

//Get Content Creators
router
  .route("/content-creator-csv")
  .get(
    authenticateUser,
    authorizePermission("1", "3"),
    getAllContentCreatorCsv
  );

//Add Category
router
  .route("/add-category")
  .post(authenticateUser, authorizePermission("1", "3"), addCategory);

//Add Sub Category
router
  .route("/add-sub-category")
  .post(authenticateUser, authorizePermission("1", "3"), addSubCategory);

//Content Management Module
router
  .route("/get-all-content")
  .get(authenticateUser, authorizePermission("1", "3"), getAllContent);
router
  .route("/terms-and-conditions")
  .put(authenticateUser, authorizePermission("1"), updateTermsAndConditions);
router
  .route("/privacy-policy")
  .put(authenticateUser, authorizePermission("1"), updatePrivacyPolicy);
router
  .route("/about-us")
  .put(authenticateUser, authorizePermission("1"), updateAboutUs);

//Get all sub-categories
router
  .route("/get-all-category")
  .get(authenticateUser, authorizePermission("1", "3"), getAllCategories);

//Get all sub-categories
router
  .route("/get-all-subcategory")
  .get(authenticateUser, authorizePermission("1", "3"), getSubCategory);

//Get All Channels
router
  .route("/channels")
  .get(authenticateUser, authorizePermission("1", "3"), getAllChannels);

//Get Content Approval
router
  .route("/content-approval")
  .get(authenticateUser, authorizePermission("1", "3"), GetContentApproval);

//Get All Videos
router
  .route("/videos")
  .get(authenticateUser, authorizePermission("1", "3"), getAllVideos);

//Get All Cat and Sub Cat
router
  .route("/category-management")
  .get(
    authenticateUser,
    authorizePermission("1", "3"),
    getAllCategoryAndSubCategory
  );

//Download Csv
router
  .route("/category-export")
  .get(
    authenticateUser,
    authorizePermission("1", "3"),
    getAllCategoryAndSubCategoryCsv
  );

//Get All Channels
router
  .route("/channel/:id")
  .get(authenticateUser, authorizePermission("1", "3"), getSingleChannel);

//Get or Delete ContentCreator
router
  .route("/contentcreator/:id")
  .get(authenticateUser, authorizePermission("1", "3"), getSingleContentCreator)
  .delete(authenticateUser, authorizePermission("1"), deleteContentCreator);

//Get Content Creator Detail Screen
router
  .route("/contentcreatordetail/:id")
  .get(
    authenticateUser,
    authorizePermission("1", "3"),
    listVideosByContentCreator
  );

//Edit ContentCreator info
router
  .route("/contentcreator/:id/edit")
  .put(
    authenticateUser,
    authorizePermission("1", "3"),
    editContentCreatorTable
  );

//change change status
router
  .route("/:id/active-channel")
  .put(
    authenticateUser,
    authorizePermission("1", "3"),
    changeChannelActiveStatus
  );

//Set Content Creator Status
router
  .route("/:id/active-contentcreator")
  .put(
    authenticateUser,
    authorizePermission("1", "3"),
    changeContentCreatorActiveStatus
  );

//Get or Delete Category
router
  .route("/category/:id")
  .get(authenticateUser, authorizePermission("1", "3"), getSingleCategory)
  .delete(authenticateUser, authorizePermission("1"), deleteCategory);

//Edit Category info
router
  .route("/category/:id/edit")
  .put(authenticateUser, authorizePermission("1"), editCategoryTable);

//reject content
router
  .route("/content/:id/reject")
  .post(authenticateUser, authorizePermission("1", "3"), rejectContent);

//accept
router
  .route("/content/:id/accept")
  .post(authenticateUser, authorizePermission("1", "3"), acceptContent);

//change Channel status
// router.route("/channel/:id/active").put(changeChannelActiveStatus);

//Get or Delete Single User
router
  .route("/:id")
  .get(authenticateUser, authorizePermission("1", "3"), getSingleUser)
  .delete(authenticateUser, authorizePermission("1"), deleteUser);

//change user status
router.route("/:id/active").put(changeActiveStatus);

// Edit User Information
router
  .route("/:id/edit")
  .put(authenticateUser, authorizePermission("1", "3"), editUserTable);

module.exports = router;
