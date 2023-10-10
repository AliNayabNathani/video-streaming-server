const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Comment = require("../models/Comment");
const User = require("../models/User");
const pusher = require("../config/pusher");
const fs = require("fs");
const path = require("path");
const OTPModel = require("../models/OTP");
const nodemailer = require("nodemailer");

//uncomment after u add auth
const postComment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    throw new CustomError.BadRequestError(
      "Please provide text for the comment"
    );
  }

  const userId = req.user.userId;
  const videoId = req.params.videoId;

  const newComment = await Comment.create({
    text,
    userId,
    videoId,
  });

  pusher.trigger("comments", "new-comment", newComment);

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Comment added successfully!", comment: newComment });
};

const getComments = async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.findAll({
    where: { videoId },
    attributes: ["id", "text", "userId"],
  });

  const formattedComments = await Promise.all(
    comments.map(async (comment) => {
      const user = await User.findByPk(comment.userId, {
        attributes: ["id", "name"],
      });

      return {
        commentId: comment.id,
        text: comment.text,
        userId: user ? user.id : null,
        userName: user ? user.name : null,
      };
    })
  );

  const totalCommentCount = await Comment.count({ where: { videoId } });

  res
    .status(StatusCodes.OK)
    .json({ comments: formattedComments, count: totalCommentCount });
};

const uploadVideo = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }

  const videoFile = req.files.video;

  if (!videoFile.mimetype.startsWith("video")) {
    throw new CustomError.BadRequestError("Video Files Only!");
  }

  //Max Size = 10MB
  const maxSize = 10 * 1024 * 1024;
  if (videoFile.size > maxSize) {
    throw new CustomError.BadRequestError("Max Video Size Should be 10MB");
  }

  const videoPath = path.join(
    __dirname,
    "../public/uploads/videos/" + `${videoFile.name}`
  );

  await videoFile.mv(videoPath);

  return res
    .status(StatusCodes.OK)
    .send({ video: { src: `/uploads/videos/${videoFile.name}` } });
};

const uploadVideoPoster = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }

  const videoPoster = req.files.image;

  if (!videoPoster.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Image Files Only!");
  }

  const maxSize = 1024 * 1024 * 1; //1MB
  if (videoPoster.size > maxSize) {
    throw new CustomError.BadRequestError("Max Image Size Should be 20MB");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/posters/" + `${videoPoster.name}`
  );

  await videoPoster.mv(imagePath);

  return res
    .status(StatusCodes.OK)
    .send({ image: { src: `/uploads/${videoPoster.name}` } });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TEST_EMAIL_USER,
    pass: process.env.TEST_EMAIL_PASSWORD,
  },
});

const otpController = {
  generateOTP: async (req, res, next) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
      const otpRecord = await OTPModel.create({ email, otp });

      transporter.sendMail({
        from: process.env.TEST_EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}`,
      });

      res.json({ success: true, message: "OTP sent successfully", otpRecord });
    } catch (error) {
      next(createError(500, "Internal server error"));
    }
  },

  verifyOTP: async (req, res, next) => {
    const { email, otp } = req.body;

    try {
      const otpRecord = await OTPModel.findOne({ where: { email, otp } });

      if (otpRecord) {
        res.json({ success: true, message: "OTP verification successful" });
      } else {
        res.json({ success: false, message: "Invalid OTP" });
      }
    } catch (error) {
      next(createError(500, "Internal server error"));
    }
  },
};

module.exports = {
  postComment,
  getComments,
  uploadVideo,
  uploadVideoPoster,
  otpController,
};
