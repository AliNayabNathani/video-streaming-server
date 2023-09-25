const express = require("express");
const { MyVideos, addNewVideo, getMyChannels, getSingleMyVideo, changeVideoStatus, submitFeedback } = require("../controllers/contentCreatorController");
const router = express.Router();


router.route("/myvideo").get(MyVideos);
router.route("/myvideo/add").post(addNewVideo);

router.route("/mychannels").get(getMyChannels);

router.route("/myvideo/:id").get(getSingleMyVideo).put(changeVideoStatus);
router.route("/feedback/:id").post(submitFeedback);

module.exports = router;
