const express = require("express");
const { MyVideos, addNewVideo, getMyChannels, getSingleMyVideo, changeVideoStatus, submitFeedback, getSingleChannelDetail, createNewChannel } = require("../controllers/contentCreatorController");
const router = express.Router();


router.route("/myvideo").get(MyVideos);
router.route("/myvideo/add").post(addNewVideo);

router.route("/mychannels").get(getMyChannels);
router.route("/mychannel/add").post(createNewChannel);

router.route("/myvideo/:id").get(getSingleMyVideo).put(changeVideoStatus);
router.route("/mychannel/:id").get(getSingleChannelDetail)
router.route("/feedback/:id").post(submitFeedback);

module.exports = router;
