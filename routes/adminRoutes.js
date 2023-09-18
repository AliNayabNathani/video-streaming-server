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
  addContentCreator,
  getAllContentCreator,
  getSubCategory,
  editCategoryTable,
  deleteCategory,
  getSingleCategory,
  getSingleContentCreator,
  deleteContentCreator,
  editContentCreatorTable,
  changeContentCreatorActiveStatus
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

//Add Content Creators
router.route("/add-content-creator").post(addContentCreator);

//Get Content Creators
router.route("/get-content-creator").get(getAllContentCreator);

//Get or Delete ContentCreator
router.route("/contentcreator/:id").get(getSingleContentCreator).delete(deleteContentCreator);

//Edit ContentCreator info
router.route("/contentcreator/:id/edit").put(editContentCreatorTable);

//Set Content Creator Status
router.route("/contentcreator/:id/active").put(changeContentCreatorActiveStatus);

//Add Category
router.route("/add-category").post(addCategory);

//Add Sub Category
router.route("/add-sub-category").post(addSubCategory);

//Get all categories
router.route("/get-all-categories").get(getSubCategory);

//Get or Delete Category
router.route("/category/:id").get(getSingleCategory).delete(deleteCategory);

//Edit Category info
router.route("/category/:id/edit").put(editCategoryTable);

//change Channel status
router.route("/channel/:id/active").put(changeChannelActiveStatus);

//Get or Delete Single User
router.route("/:id").get(getSingleUser).delete(deleteUser);

//change status
router.route("/:id/active").put(changeActiveStatus);

// Edit User Information
router.route("/:id/edit").put(editUserTable);

module.exports = router;
