const express = require("express");
const router = express.Router();
const {
  MyVideos,
  getMyChannels,
  getChannelById,
} = require("../controllers/clientController");

router.route("/myvideo").get(MyVideos);

router.route("/mychannels").get(getMyChannels);

// router.route("/mychannels/:id").get(getChannelById);

module.exports = router;
