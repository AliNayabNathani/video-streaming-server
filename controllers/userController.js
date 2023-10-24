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
const device = require('device');
const userAgentParser = require('ua-parser-js');
const ipinfo = require('ipinfo');
const Device = require("../models/Device");
const ContentManagement = require("../models/ContentManagement");
const { Server } = require('socket.io');

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

const addDevice = async (req, res) => {
    const { userId } = req.body;
    console.log('User ID: ', userId);

    const userAgent = req.get('User-Agent');
    const userDevice = device(userAgent);
    const parsedUserAgent = userAgentParser(userAgent);
    const deviceInfo = {
        type: userDevice.type,
        isMobile: userDevice.is('phone') || userDevice.is('tablet'),
        model: parsedUserAgent.device.model,
        os: parsedUserAgent.os.name,
        osVersion: parsedUserAgent.os.version,
    };
    const model = deviceInfo.model || deviceInfo.os;
    // const clientIp = req.ipInfo;
    const clientIp = '103.244.177.88';
    const geoData = await ipinfo(clientIp);
    const location = `${geoData.city}, ${geoData.region}, ${geoData.country}`;
    // Now, 'location' contains the user's approximate location
    console.log('User Location:', location);
    const existingDevice = await Device.findOne({ where: { model, device_id: userId } })
    console.log('existing', existingDevice);
    let newDevice;
    if (!existingDevice) {
        newDevice = await Device.create({
            user_id: userId,
            model: deviceInfo.model,
            os: deviceInfo.os,
            location: location,
        });
    }
    return res
        .status(StatusCodes.OK)
        .json({ newDevice, msg: 'Device Info Extracted' })
}

const getDevice = async (req, res) => {
    const devices = await Device.findAll({});

    const deviceData = await Promise.all(
        devices.map(async (device) => {
            const user = await User.findByPk(device.user_id);
            return {
                model: device.model,
                os: device.os,
                location: device.location,
                updatedAt: device.updatedAt,
            }
        })
    )

    const deviceDataLength = deviceData.length;

    res
        .status(StatusCodes.OK)
        .json({ device: deviceData, count: deviceDataLength });
}

const TermsandConditions = async (req, res) => {
    const termsAndConditionsItem = await ContentManagement.findOne({
        where: { name: "Terms And Conditions" },
    });

    res
        .status(StatusCodes.OK)
        .json({ termsAndConditionsItem });
}

const privacyPolicy = async (req, res) => {
    const privacyPolicyItem = await ContentManagement.findOne({
        where: { name: "Privacy Policy" },
    });

    res
        .status(StatusCodes.OK)
        .json({ privacyPolicyItem });
}

const SupportChat = ({ server }) => {

}

module.exports = {
    AllChannels,
    createProfile,
    getProfiles,
    addDevice,
    getDevice,
    TermsandConditions,
    privacyPolicy,
    SupportChat
}