const express = require("express");
const router = express.Router();
const {
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
  updateTermsAndConditions,
  updatePrivacyPolicy,
  updateAboutUs,
  getAllContent,
} = require("../controllers/adminController");
const { authorizePermission } = require("../middleware/authentication");

//get All Users
router.route("/").get(getAllUsers);

//export csv
router.route("/export-users-csv").get(exportCsv);

//Add New User
router.route("/add-new-user").post(addNewUser);

//Add Coupon
router.route("/add-new-coupon").post(addNewCoupon);

//Get Coupon
router.route("/get-coupons").get(getAllCoupons);

//Add Category
router.route("/add-category").post(addCategory);

//Add Sub Category
router.route("/add-sub-category").post(addSubCategory);

//Content Management Module
router.route("/get-all-content").get(getAllContent);

router.route("/terms-and-conditions").put(updateTermsAndConditions);

router.route("/privacy-policy").put(updatePrivacyPolicy);

router.route("/about-us").put(updateAboutUs);

//get Single User
router.route("/:id").get(getSingleUser).delete(deleteUser);

//change status
router.route("/:id/active").put(changeActiveStatus);

// Edit User Information
router.route("/:id/edit").put(editUserTable);

//Add Content Creators
module.exports = router;
