const express = require("express");
const {
  postComment,
  getComments,
  uploadVideo,
  uploadVideoPoster,
  otpController,
  stripeController,
} = require("../controllers/otherController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/videos/:videoId/comments")
  .post(authenticateUser, postComment)
  .get(getComments);

router
  .route("/uploadVideo")
  .post(authenticateUser, authorizePermission("4"), uploadVideo);

router.route("/uploadPicture").post(authenticateUser, uploadVideoPoster);

// Generate OTP and store it in the database
router.post("/generate-otp", otpController.generateOTP);

// Verify OTP
router.post("/verify-otp", otpController.verifyOTP);

// Verify OTP
router.post("/stripe", stripeController);

module.exports = router;
