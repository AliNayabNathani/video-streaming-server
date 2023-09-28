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
  getSingleEpisode,
  getSingleTrailer,
} = require("../controllers/contentCreatorController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const router = express.Router();

router.route("/myvideo").get(authenticateUser, MyVideos);
router
  .route("/myvideo/add")
  .post(authenticateUser, authorizePermission("4"), addNewVideo);

router.route("/mychannels").get(authenticateUser, getMyChannels);
router
  .route("/mychannel/add")
  .post(authenticateUser, authorizePermission("4"), createNewChannel);

router
  .route("/get-support")
  .get(authenticateUser, getSupport)
  .patch(authenticateUser, authorizePermission("1"), updateSupport);

router
  .route("/mychannel/:id")
  .get(getSingleChannelDetail)
  .delete(authenticateUser, authorizePermission("4"), deleteChannel);

router
  .route("/myvideo/:id")
  .get(authenticateUser, getSingleMyVideo)
  .put(authenticateUser, authorizePermission("1", "4"), changeVideoStatus);

router.route("/trailer/:id").get(authenticateUser, getSingleTrailer);

router
  .route("/add-episode/:id")
  .post(authenticateUser, authorizePermission("4"), addNewEpisodeToVideo);
router
  .route("/episodes/:id")
  .get(authenticateUser, getSingleEpisode)
  .delete(authenticateUser, authorizePermission("1", "4"), deleteEpisode);
router
  .route("/add-trailer/:id")
  .post(authenticateUser, authorizePermission("1", "4"), addNewTrailerToVideo);
router
  .route("/feedback/:id")
  .post(authenticateUser, authorizePermission("1", "4"), submitFeedback);

module.exports = router;
