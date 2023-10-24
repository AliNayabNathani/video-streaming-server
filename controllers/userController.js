const ContentCreator = require("../models/ContentCreator");
const Trailer = require("../models/Trailer");
const Video = require("../models/Video");
const { Op } = require("sequelize");
const sequelize = require("../config/sequelize");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Channel = require("../models/Channel");
const Episode = require("../models/Episodes");
const Member = require("../models/members");
const User = require("../models/User");

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

const createProfile = async (req, res) => {
    const { userName, name, avatar } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ where: { name: userName } });
    if (!existingUser) {
        throw new CustomError.NotFoundError("User Not Found. Create User First");
    }
    const member = await Member.create({ name, avatar, user_id: existingUser.id });
    console.log(member);
    res
        .status(StatusCodes.CREATED)
        .json({ member, msg: "Member Added." });
}

const getProfiles = async (req, res) => {
    const members = await Member.findAll({});
    const memberData = await Promise.all(
        members.map(async (member) => {
            return {
                id: member.id,
                name: member.name,
                avatar: member.avatar
            }
        })
    );
    const memberCount = members.length;

    res
        .status(StatusCodes.OK)
        .json({ members: memberData, count: memberCount });
};

const getDevice = (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    // Find the device information for the user
    const userDeviceInfo = userDevices[userId];

    const loginTime = userDeviceInfo.loginTime;


    return res.
        status(StatusCodes.OK)
        .json({ userDeviceInfo, loginTime, msg: 'Device Info Extracted' })
}


module.exports = {
    AllChannels,
    createProfile,
    getProfiles,
    getDevice
}