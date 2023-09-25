const User = require("../models/User");
const Role = require("../models/Role");
const Feedback = require("../models/Feedback");
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
const { uploadVideo, uploadVideoPoster } = require("./otherController");

const MyVideos = async (req, res) => {
    const userId = "10";


    const contentCreator = await ContentCreator.findOne({
        where: {
            user_id: userId,
        },
    });

    if (!contentCreator) {
        throw new CustomError.NotFoundError(`User is not a content creator.`);
    }


    const contentCreatorId = contentCreator.id

    const myShows = await Video.findAll({
        where: {
            channelId: {
                [Op.in]: sequelize.literal(
                    `(SELECT id FROM channel WHERE content_creator_id = ${contentCreatorId})`
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
    const { id: videoId } = req.params;
    // console.log(videoId);

    const video = await Video.findByPk(videoId, {

        include: [
            { model: Trailer, as: "trailers" },
            { model: Episode, as: "episodes" },
        ],
    });

    if (!video) {
        throw new CustomError.NotFoundError(`Video not found.`);
    }

    res.status(StatusCodes.OK).json({ video });
};

const changeVideoStatus = async (req, res) => {
    const { id: videoId } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
        throw new CustomError.BadRequestError("Invalid status.");
    }

    const video = await Video.findByPk(videoId);

    if (!video) {
        throw new CustomError.NotFoundError("Video not found.");
    }

    video.status = status;
    await video.save();

    res.status(StatusCodes.OK).json({ message: "Video status updated successfully." });
};

const addNewVideo = async (req, res) => {

    const {
        title: videoTitle,
        rented_amount,
        purchasing_amount,
        Genre,
        description,
        Cast,
        // category,
        // country,
        Type,
        trailer: {
            title: trailerTitle,
            poster: trailerPoster,
            file: trailerVideo,
        },
        episodes,
    } = req.body;

    const video = await Video.create({
        title: videoTitle || "Video Title",
        rented_amount,
        purchasing_amount,
        Genre,
        description,
        Cast,
        Type,
    });


    const trailer = await Trailer.create({
        title: trailerTitle || "Trailer Title",
        file: trailerVideo,
        poster: trailerPoster,
        videoId: video.id,
    });

    if (Array.isArray(episodes)) {
        for (const episodeData of episodes) {
            const episode = await Episode.create({
                title: episodeData.title || "Episode Title",
                file: episodeData.file,
                poster: episodeData.poster,
                videoId: video.id,
            });
        }
    }

    res.status(StatusCodes.CREATED).json({ video, trailer, episodes });
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

const submitFeedback = async (req, res) => {
    const userId = "10"; //req.user after auth kardena
    const { id: videoId } = req.params;
    const { rating, comment, } = req.body;


    if (!rating || rating < 1 || rating > 5) {
        throw new CustomError.BadRequestError("Rating must be between 1 and 5.");
    }

    const feedback = await Feedback.create({
        rating,
        comment,
        userId,
        videoId,
    });

    res.status(StatusCodes.CREATED).json({ feedback });
};

module.exports = { MyVideos, getMyChannels, getSingleMyVideo, changeVideoStatus, addNewVideo, submitFeedback };
