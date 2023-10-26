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
const { sendEmail } = require("../utils/sendMail");

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

const GetMovies = async (req, res) => {
    const movies = await Video.findAll({ where: { Type: 'Movie' } });
    console.log(movies);
    res
        .status(StatusCodes.OK)
        .json({ movies, msg: 'Movies Extracted' });
}

const GetSeries = async (req, res) => {
    const Series = await Video.findAll({ where: { Type: 'Series' } });
    console.log(Series);
    res
        .status(StatusCodes.OK)
        .json({ Series, msg: 'Series Extracted' });
}

const sendTestMailToSupport = async (req, res) => {
    const { userId, complaint } = req.body;

    const user = await User.findByPk(userId);
    console.log(user);
    const to = 'recipient@example.com';
    const subject = `Complaint from User ${userId}`;
    const template = `
    <!DOCTYPE html>
<html>
<head>
    <title>Complaint Forwarded to Support</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }

        .container {
            background-color: #ffffff;
            padding: 30px;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #e0e0e0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }

        p {
            color: #555;
            font-size: 16px;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Complaint Forwarded to Support</h1>
        <br />
        <p><strong>Name:</strong> ${user.dataValues.name}</p> 
        <p><strong>Email:</strong> ${user.dataValues.email}</p>
        <p><strong>Complaint:</strong></p>
        <p>${complaint}</p>
        <br />
        <p>We kindly request your immediate attention to this matter. Please review this complaint with utmost care and professionalism, and take the necessary actions to assist and resolve the customer's concern promptly. Your expertise and dedication to customer satisfaction are greatly appreciated.</p>
    </div>
</body>
</html>`;

    const info = await sendEmail(to, subject, template);
    console.log(info);
    res.status(StatusCodes.OK)
        .send('Email Sent Successfully');
}

const sendTestMailToUser = async (req, res) => {
    const { userId, complaint } = req.body;

    const user = await User.findByPk(userId);
    console.log(user);
    const to = user.dataValues.email;
    const subject = `Confirmation: Your Query is Being Addressed`;
    const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Your Query is Being Resolved</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
            }
    
            .container {
                background-color: #ffffff;
                padding: 30px;
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #e0e0e0;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                color: #333;
                font-size: 24px;
                margin-bottom: 20px;
            }
    
            p {
                color: #555;
                font-size: 16px;
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Your Query  is Being Resolved</h1>
            <br />
            <br />
            <p><strong>Dear ${user.dataValues.name},</strong></p>
            <br />
            <p>Your Complaint: <br /> <strong> ${complaint},</strong> </p>
            <br />
            <p>We appreciate you reaching out to us with your query. Your concerns are important to us, and we want to assure you that our dedicated support team is actively working to address your request as swiftly as possible.</p>
            <br />
            <p>Our commitment is to provide you with a prompt and effective solution, and we will keep you updated on the progress of your query. Please rest assured that your satisfaction is our top priority.</p>
            <br />
            <p>If you have any further information to share or any additional questions, please feel free to reply to this email, and we will be glad to assist you further.</p>
            <br />
            <p>Thank you for choosing our services.</p>
        </div>
    </body>
    </html>
    `;
    const info = await sendEmail(to, subject, template);
    console.log(info);
    res.status(StatusCodes.OK)
        .send('Email Sent Successfully');
}

module.exports = {
    AllChannels,
    createProfile,
    getProfiles,
    addDevice,
    getDevice,
    TermsandConditions,
    privacyPolicy,
    GetMovies,
    GetSeries,
    sendTestMailToSupport,
    sendTestMailToUser
}