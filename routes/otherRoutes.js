const express = require("express");
const {
  postComment,
  getComments,
  uploadVideo,
  uploadVideoPoster,
} = require("../controllers/otherController");
const router = express.Router();

router.route("/videos/:videoId/comments").post(postComment).get(getComments);
router.route("/uploadVideo").post(uploadVideo);
router.route("/uploadPicture").post(uploadVideoPoster);

module.exports = router;
