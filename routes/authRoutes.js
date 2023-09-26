const express = require("express");
const router = express.Router();
const {
  login,
  register,
  updatePassword,
  updateProfile,
} = require("../controllers/authController");

//To Register a new User
router.route("/register").post(register);

//Login
router.route("/login").post(login);

//UpdatePassword
router.route("/changepassword").patch(updatePassword);

//UpdatePassword
router.route("/updateprofile").patch(updateProfile);

//Logout
// router.route("/logout").get(logout);

module.exports = router;
