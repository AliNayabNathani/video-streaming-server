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
  deleteCoupon,
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
  changeVideoStatus,
  getSingleVideo,
  deleteSingleVideo,
  changeCouponStatus,
  getAllActiveVideos,
  getAllPendingVideos,
  getAllactiveinactiveVideos,
  getAnyVideoByStatus,
} = require("../controllers/adminController");
const {
  authorizePermission,
  authenticateUser,
} = require("../middleware/authentication");

//get All Users
router.route("/").get(authenticateUser, getAllUsers);

//export user csv
router.route("/export-users-csv").get(authenticateUser, UserExportCsv);

//Add New User
router.route("/add-new-user").post(authenticateUser, addNewUser);

//Add Coupon
router.route("/add-new-coupon").post(authenticateUser, addNewCoupon);

//Get Coupon
router.route("/get-coupons").get(authenticateUser, getAllCoupons);

//Add Content Creators
router.route("/add-content-creator").post(authenticateUser, addContentCreator);

//Get Content Creators
router
  .route("/get-content-creator")
  .get(authenticateUser, getAllContentCreator);

//Get Content Creators
router
  .route("/content-creator-csv")
  .get(
    authenticateUser,
    authorizePermission("1", "3"),
    getAllContentCreatorCsv
  );

//Add Category
router.route("/add-category").post(authenticateUser, addCategory);

//Add Sub Category
router.route("/add-sub-category").post(authenticateUser, addSubCategory);

//Content Management Module
router.route("/get-all-content").get(authenticateUser, getAllContent);

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
router.route("/get-all-category").get(authenticateUser, getAllCategories);

//Get all sub-categories
router.route("/get-all-subcategory").get(authenticateUser, getSubCategory);

//Get All Channels
router.route("/channels").get(authenticateUser, getAllChannels);

//Get Content Approval
router.route("/content-approval").get(authenticateUser, GetContentApproval);

//Get All Videos
router.route("/videos").get(authenticateUser, getAllVideos);

//Get All Active-Inactive Videos
router
  .route("/active-inactive-videos")
  .get(authenticateUser, getAllactiveinactiveVideos);

//Get All Active Videos
router.route("/active-videos").get(authenticateUser, getAllActiveVideos);

//Get All Pending Videos
router.route("/pending-videos").get(authenticateUser, getAllPendingVideos);

//Get Any Video By Status
router.route("/any-videos").get(authenticateUser, getAnyVideoByStatus);

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

//reject content
router.route("/content/:id/reject").post(authenticateUser, rejectContent);

//accept
router.route("/content/:id/accept").post(authenticateUser, acceptContent);

//Get Single Channels
router.route("/channel/:id").get(authenticateUser, getSingleChannel);

//Get or Delete ContentCreator
router
  .route("/contentcreator/:id")
  .get(authenticateUser, getSingleContentCreator)
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

//change channel status
router.route("/:id/active-channel").put(
  // authenticateUser,
  // authorizePermission("1", "3"),
  changeChannelActiveStatus
);

//change video Status
router.route("/:id/active-video").put(changeVideoStatus);

//get singe video
router.route("/video/:id").get(getSingleVideo).delete(deleteSingleVideo);

//Set Content Creator Status
router.route("/:id/active-contentcreator").put(
  // authenticateUser,
  // authorizePermission("1", "3"),
  changeContentCreatorActiveStatus
);

//Delete Coupon
router.route("/coupon/:id").delete(deleteCoupon).put(changeCouponStatus);

//Get or Delete Category
router
  .route("/category/:id")
  .get(authenticateUser, getSingleCategory)
  .delete(authenticateUser, authorizePermission("1"), deleteCategory);

//Edit Category info
router.route("/category/:id/edit").put(authenticateUser, editCategoryTable);

//change Channel status
// router.route("/channel/:id/active").put(changeChannelActiveStatus);

//Get or Delete Single User
router
  .route("/:id")
  .get(authenticateUser, getSingleUser)
  .delete(authenticateUser, authorizePermission("1"), deleteUser);

//change user status
router.route("/:id/active").put(changeActiveStatus);

// Edit User Information
router.route("/:id/edit").put(authenticateUser, editUserTable);

module.exports = router;
