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
} = require("../controllers/adminController");
const { authorizePermission } = require("../middleware/authentication");

//get All Users
router.route("/").get(getAllUsers);

//export csv
router.route("/export-users-csv").get(exportCsv);

//Add New User
router.route("/add-new-user").post(addNewUser);

//get Single User
router.route("/:id").get(getSingleUser).delete(deleteUser);

//change status
router.route("/:id/active").put(changeActiveStatus);

// Edit User Information
router.route("/:id/edit").put(editUserTable);

module.exports = router;
