const User = require("../models/User");
const Role = require("../models/Role");
const ContentCreator = require("../models/ContentCreator");
const Channel = require("../models/Channel");
const json2csv = require("json2csv");
const fs = require("fs").promises;
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { STATUS_CODES } = require("http");
const Video = require("../models/Video");
const ContentApproval = require("../models/ContentApproval");

const MyVideos = async (req, res) => {
  const videos = await Video.findAll({
    raw: true,
    attributes: [
      "id",
      "name",
      "views",
      "rented_amount",
      "purchasing_amount",
      "createdAt",
      "channelId",
    ],
  });

  if (!videos || videos.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `No Videos found!!` });
  }

  const videoIds = videos.map((video) => video.id);

  const contentApprovals = await ContentApproval.findAll({
    where: { video_id: videoIds },
    raw: true,
  });

  const videoStatusMap = {};
  contentApprovals.forEach((approval) => {
    videoStatusMap[approval.video_id] = approval.status;
  });

  videos.forEach((video) => {
    video.status = videoStatusMap[video.id] || "Pending";
  });

  const channelIds = videos.map((video) => video.channelId);

  const channels = await Channel.findAll({
    where: { id: channelIds },
    raw: true,
    attributes: ["id", "content_creator_id"],
  });

  const creatorIds = channels.map((channel) => channel.content_creator_id);

  const contentCreators = await ContentCreator.findAll({
    where: { id: creatorIds },
    raw: true,
    attributes: ["id", "name"],
  });

  const creatorMap = contentCreators.reduce((map, creator) => {
    map[creator.id] = creator.name;
    return map;
  }, {});

  videos.forEach((video) => {
    const channel = channels.find((channel) => channel.id === video.channelId);
    if (channel) {
      video.creator_name = creatorMap[channel.content_creator_id];
    }
  });

  const videosCount = videos.length;
  res.status(StatusCodes.OK).json({ videos, videosCount });
};

const getMyChannels = async (req, res) => {
  const userId = 1;

  const channels = await Channel.findAll({
    where: { content_creator_id: userId },
    raw: true,
    attributes: ["id", "name", "content_creator_id"],
  });

  if (!channels || channels.length === 0) {
    throw new CustomError.NotFoundError(
      `No channels found for the current user.`
    );
  }

  const channelCount = channels.length;

  res.status(StatusCodes.OK).json({ channels, channelCount });
};

module.exports = { MyVideos, getMyChannels };
