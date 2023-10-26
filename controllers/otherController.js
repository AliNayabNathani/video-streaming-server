const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Comment = require("../models/Comment");
const User = require("../models/User");
const pusher = require("../config/pusher");
const path = require("path");

//uncomment after u add auth
// const postComment = async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     throw new CustomError.BadRequestError(
//       "Please provide text for the comment"
//     );
//   }

//   const userId = req.oidc.user.id;
//   const videoId = req.params.videoId;

//   const newComment = await Comment.create({
//     text,
//     userId,
//     videoId,
//   });

//   pusher.trigger("comments", "new-comment", newComment);

//   res
//     .status(StatusCodes.CREATED)
//     .json({ msg: "Comment added successfully!", comment: newComment });
// };

const postComment = async (req, res) => {
  const { text, userId } = req.body;
  const { videoId } = req.params;

  if (!text || !videoId) {
    throw new CustomError.BadRequestError(`Please provide text and videoId`);
  }

  //   const userId = req.oidc?.user?.sub || "defaultUserId";

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
  console.log(req);

  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }

  const videoFile = req.files.Video;

  if (!videoFile.mimetype.startsWith("video")) {
    throw new CustomError.BadRequestError("Video Files Only!");
  }

  //Max Size = 10MB
  const maxSize = 20 * 1024 * 1024;
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
  console.log(req);
  if (!req.body) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }
  const videoPoster = req.files.image;
  if (!videoPoster?.mimetype?.startsWith("image")) {
    throw new CustomError.BadRequestError("Image Files Only!");
  }

  const maxSize = 1024 * 1024 * 20 //5MB
  if (videoPoster.size > maxSize) {
    throw new CustomError.BadRequestError("Max Image Size Should be 5mb");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/posters/" + `${videoPoster.name}`
  );

  await videoPoster?.mv(imagePath);

  return res
    .status(StatusCodes.OK)
    .send({ image: { src: `/uploads/${videoPoster}` } });
};

module.exports = { postComment, getComments, uploadVideo, uploadVideoPoster };
