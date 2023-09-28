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
  .post(authenticateUser, authorizePermission("4"), uploadVideo);
router.route("/uploadPicture").post(authenticateUser, uploadVideoPoster);

module.exports = router;
