const ContentCreator = require("../models/ContentCreator");
const Trailer = require("../models/Trailer");
const Video = require("../models/Video");
const { Op } = require("sequelize");
const sequelize = require("../config/sequelize");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Channel = require("../models/Channel");
const Episode = require("../models/Episodes");

const AllChannels = async (req, res) => {
    const channels = await Channel.findAll({
        raw: true,
        attributes: ["id", "name", "content_creator_id", "createdAt"],
    });
    console.log('channels:', channels);
    if (!channels || channels.length === 0) {
        throw new CustomError.NotFoundError(`No Channel found!!`);
    }

    const creatorIds = channels.map((channel) => channel.content_creator_id);

    const ChannelVideos = await Promise.all(
        creatorIds.map((id) =>
            Channel.findAll({
                where: { content_creator_id: id },
                attributes: ["id", "name", "content_creator_id"],
                include: [
                    {
                        model: Video,
                        as: "videos",
                        attributes: ["id", "name", "views", "Type"],
                        include: [
                            {
                                model: Episode,
                                as: "episodes",
                                attributes: ["id", "poster", "file", "title", "description"],
                            },
                        ],
                    },
                ],
            })
        )
    );

    const channelCount = channels.length;
    res.status(StatusCodes.OK).json({ ChannelVideos, channelCount });

};

module.exports = {
    AllChannels,
}