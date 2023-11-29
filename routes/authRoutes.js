const express = require("express");
const router = express.Router();
const {
  login,
  register,
  updatePassword,
  updateProfile,
  logout,
  adminLogin,
  userLogin,
  contentCreatorLogin,
} = require("../controllers/authController");
const {
  authorizePermission,
  authenticateUser,
} = require("../middleware/authentication");

//To Register a new User
router.route("/register").post(register);

//Login
router.route("/login").post(login);

//Admin Login
router.route("/login/admin").post(adminLogin);
//user login
router.route("/login/user").post(userLogin);
//creatorlogin
router.route("/login/creator").post(contentCreatorLogin);

//To logout User
router.route("/logout").get(logout);

//UpdatePassword
router.route("/changepassword").patch(authenticateUser, updatePassword);

//UpdatePassword
router.route("/updateprofile").patch(authenticateUser, updateProfile);

//Logout
// router.route("/logout").get(logout);

module.exports = router;
