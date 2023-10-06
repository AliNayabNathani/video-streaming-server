const express = require("express");
const {
  postComment,
  getComments,
  uploadVideo,
  uploadVideoPoster,
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
  .post(authenticateUser, uploadVideo);
router.route("/uploadPicture").post(uploadVideoPoster);

module.exports = router;
