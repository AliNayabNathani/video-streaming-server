const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");

//To Register a new User
router.route("/register").post(register);

//Login
router.route("/login").post(login);

//Logout
// router.route("/logout").get(logout);

module.exports = router;
