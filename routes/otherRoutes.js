const express = require("express");
const {
  postComment,
  getComments,
  uploadVideo,
  uploadVideoPoster,
  otpController,
  stripeController,
  purchaseVideo,
  rentVideo,
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

router.route("/uploadVideo").post(authenticateUser, uploadVideo);
router.route("/uploadPicture").post(uploadVideoPoster);

// Generate OTP and store it in the database
router.post("/generate-otp", otpController.generateOTP);

// Verify OTP
router.post("/verify-otp", otpController.verifyOTP);

// Stripe Payments
router.post("/stripe", stripeController);
router.post("/purchase-video", purchaseVideo);
router.post("/rent-video", rentVideo);

module.exports = router;
