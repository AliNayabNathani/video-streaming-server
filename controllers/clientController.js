const User = require("../models/User");
const Role = require("../models/Role");
const ContentCreator = require("../models/ContentCreator");
const Trailer = require("../models/Trailer");
const Episode = require("../models/Episodes");
const Channel = require("../models/Channel");
const json2csv = require("json2csv");
const fs = require("fs").promises;
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { STATUS_CODES } = require("http");
const Video = require("../models/Video");
const ContentApproval = require("../models/ContentApproval");
const { Op } = require("sequelize");
const sequelize = require("../config/sequelize");

const MyVideos = async (req, res) => {
  const userId = "1";

  const myShows = await Video.findAll({
    where: {
      channelId: {
        [Op.in]: sequelize.literal(
          `(SELECT id FROM channel WHERE content_creator_id = ${userId})`
        ),
      },
    },
    attributes: [
      "id",
      "name",
      "views",
      "rented_amount",
      "purchasing_amount",
      "Type",
      "createdAt",
      "channelId",
    ],
    include: [{ model: Trailer, as: "trailers" }],
  });

  if (!myShows || myShows.length === 0) {
    throw new CustomError.NotFoundError(`No Videos found!!`);
  }

  const showCount = myShows.length;
  res.status(StatusCodes.OK).json({ myShows, showCount });
};

const getSingleMyVideo = async (req, res) => {
  const userId = "1";

  const myShows = await Video.findAll({
    where: {
      channelId: {
        [Op.in]: sequelize.literal(
          `(SELECT id FROM channel WHERE content_creator_id = ${userId})`
        ),
      },
    },
    attributes: [
      "id",
      "name",
      "views",
      "rented_amount",
      "purchasing_amount",
      "Type",
      "createdAt",
      "channelId",
    ],
    include: [{ model: Trailer, as: "trailers" }],
  });

  if (!myShows || myShows.length === 0) {
    throw new CustomError.NotFoundError(`No Videos found!!`);
  }

  const showCount = myShows.length;
  res.status(StatusCodes.OK).json({ myShows, showCount });
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
