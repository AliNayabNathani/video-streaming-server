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
  createNewChannelWithEpisodes,
  getSupport,
  updateSupport,
  deleteChannel,
  addNewEpisodeToVideo,
  addNewTrailerToVideo,
  deleteEpisode,
  getSingleEpisode,
  getSingleTrailer,
} = require("../controllers/contentCreatorController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const router = express.Router();

router.route("/myvideo").get(MyVideos);
router.route("/myvideo/add").post(authenticateUser, addNewVideo);

router.route("/mychannels").get(authenticateUser, getMyChannels);
// router
//   .route("/mychannel/add")
//   .post(authenticateUser, createNewChannelWithEpisodes);

router
  .route('/mychannel/add')
  .post(authenticateUser, createNewChannel);

router
  .route("/get-support")
  .get(authenticateUser, getSupport)
  .patch(authenticateUser, updateSupport);

router
  .route("/mychannel/:id")
  .get(getSingleChannelDetail)
  .delete(authenticateUser, deleteChannel);

router
  .route("/myvideo/:id")
  .get(authenticateUser, getSingleMyVideo)
  .put(authenticateUser, changeVideoStatus);

router.route("/trailer/:id").get(authenticateUser, getSingleTrailer);

router.route("/add-episode/:id").post(authenticateUser, addNewEpisodeToVideo);

router
  .route("/episodes/:id")
  .get(authenticateUser, getSingleEpisode)
  .delete(authenticateUser, deleteEpisode);
router.route("/add-trailer/:id").post(authenticateUser, addNewTrailerToVideo);
router.route("/feedback/:id").post(authenticateUser, submitFeedback);

module.exports = router;
