const express = require("express");
const {
  MyVideos,
  addNewVideo,
  getMyChannels,
  getSingleMyVideo,
  changeVideoStatus,
  submitFeedback,
  getSingleChannelDetail,
  createNewChannel,
  getSupport,
  updateSupport,
  deleteChannel,
  addNewEpisodeToVideo,
  addNewTrailerToVideo,
  deleteEpisode,
} = require("../controllers/contentCreatorController");
const router = express.Router();

router.route("/myvideo").get(MyVideos);
router.route("/myvideo/add").post(addNewVideo);

router.route("/mychannels").get(getMyChannels);
router.route("/mychannel/add").post(createNewChannel);

router.route("/get-support").get(getSupport).patch(updateSupport);

router
  .route("/mychannel/:id")
  .get(getSingleChannelDetail)
  .delete(deleteChannel);

router.route("/myvideo/:id").get(getSingleMyVideo).put(changeVideoStatus);
router.route("/add-episode/:id").post(addNewEpisodeToVideo);
router.route("/episodes/:id").delete(deleteEpisode);
router.route("/add-trailer/:id").post(addNewTrailerToVideo);
router.route("/feedback/:id").post(submitFeedback);

module.exports = router;
