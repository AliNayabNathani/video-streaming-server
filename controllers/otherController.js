const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Video = require("../models/Video");
const pusher = require("../config/pusher");
const path = require("path");
const OTPModel = require("../models/OTP");
const Payment = require("../models/Payment");
const nodemailer = require("nodemailer");
const Subscription = require("../models/Subscription");
const stripe = require("stripe")(
  "sk_test_51NcJPPC3eQWXYigjQevJ42k0hp6NUXq7dF745HA7ITXVd9GZO9mnnqRbnLq1o97pAi6H020T6KRbyrZ6dG1DqFsx00GQOnrNqd"
);

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

  const maxSize = 1024 * 1024 * 20; //5MB
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

//this one was for checking
const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body;

  const calculateTotal = () => {
    return total_amount + shipping_fee;
  };

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateTotal(),
    currency: "usd",
  });

  res.status(StatusCodes.OK).json({
    msg: "Payment successfuly!",
    clientSecret: paymentIntent.client_secret,
  });
};

const purchaseVideo = async (req, res) => {
  const { videoId, paymentMethodId, userId } = req.body;

  const userCheck = await User.findByPk(userId);
  if (!userCheck) {
    throw new CustomError.BadRequestError("Please Login First.");
  }

  const paymentCheck = await Payment.findOne({
    where: { user_id: userId, video_id: videoId },
  });
  if (paymentCheck) {
    throw new CustomError.BadRequestError(
      `You have already purchased the video.`
    );
  }
  const video = await Video.findByPk(videoId);
  if (!video) {
    throw new CustomError.NotFoundError("Video not found.");
  }

  const amount = video.purchasing_amount;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method: paymentMethodId,
    confirmation_method: "automatic",
    return_url: "https://your-website.com/return",
    confirm: true,
  });

  // console.log("mai status hun: ", paymentIntent.status);

  if (paymentIntent.status === "requires_confirmation") {
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id
    );

    // console.log("mai confirm hun: ", confirmedPaymentIntent);

    if (confirmedPaymentIntent.status === "succeeded") {
      const payment = await Payment.create({
        user_id: userId,
        paymentIntentId: confirmedPaymentIntent.id,
        paymentMethodId: paymentMethodId,
        amount: amount,
        status: "succeeded",
      });

      return res.status(StatusCodes.OK).json({
        msg: "Payment successful!",
        paymentIntentId: confirmedPaymentIntent.id,
        paymentId: payment.id,
      });
    } else {
      throw new CustomError.PaymentError("Payment confirmation failed.");
    }
  } else if (paymentIntent.status === "succeeded") {
    const payment = await Payment.create({
      user_id: userId,
      paymentIntentId: paymentIntent.id,
      paymentMethodId: paymentMethodId,
      video_id: videoId,
      amount: amount,
      status: "succeeded",
    });

    return res.status(StatusCodes.OK).json({
      msg: "Payment successful!",
      paymentIntentId: paymentIntent.id,
      paymentId: payment.id,
    });
  } else {
    throw new CustomError.BadRequestError("Payment failed.");
  }
};

const rentVideo = async (req, res) => {
  const { videoId, userId, paymentMethodId } = req.body;

  let dayCount = 30;
  const userCheck = await User.findByPk(userId);
  console.log(userCheck);
  if (!userCheck) {
    throw new CustomError.BadRequestError("Please Login First.");
  }

  const paymentCheck = await Subscription.findOne({
    where: { user_id: userId, video_id: videoId },
  });
  if (paymentCheck) {
    throw new CustomError.BadRequestError(`You have already rented the video.`);
  }
  const video = await Video.findByPk(videoId);
  if (!video) {
    throw new CustomError.NotFoundError("Video not found.");
  }

  const amount = video.rented_amount * dayCount;

  const currentDate = new Date();
  const currentPeriodEnd = new Date(
    currentDate.getTime() + dayCount * 24 * 60 * 60 * 1000
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method: paymentMethodId,
    confirmation_method: "automatic",
    return_url: "https://your-website.com/return",
    confirm: true,
  });

  console.log("mai status hun: ", paymentIntent.status);

  if (paymentIntent.status === "requires_confirmation") {
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id
    );

    // console.log("mai confirm hun: ", confirmedPaymentIntent);

    if (confirmedPaymentIntent.status === "succeeded") {
      const payment = await Subscription.create({
        user_id: userId,
        video_id: videoId,
        paymentIntentId: confirmedPaymentIntent.id,
        paymentMethodId: paymentMethodId,
        amount: amount,
        currentPeriodEnd: currentPeriodEnd,
        status: "active",
      });

      return res.status(StatusCodes.OK).json({
        msg: "Payment successful!",
        paymentIntentId: confirmedPaymentIntent.id,
        paymentId: payment.id,
      });
    } else {
      throw new CustomError.PaymentError("Payment confirmation failed.");
    }
  } else if (paymentIntent.status === "succeeded") {
    const payment = await Subscription.create({
      user_id: userId,
      paymentIntentId: paymentIntent.id,
      paymentMethodId: paymentMethodId,
      video_id: videoId,
      amount: amount,
      currentPeriodEnd: currentPeriodEnd,
      status: "active",
    });

    return res.status(StatusCodes.OK).json({
      msg: "Payment successful!",
      paymentIntentId: paymentIntent.id,
      paymentId: payment.id,
    });
  } else {
    throw new CustomError.BadRequestError("Payment failed.");
  }
};

module.exports = {
  postComment,
  getComments,
  uploadVideo,
  uploadVideoPoster,
  otpController,
  stripeController,
  purchaseVideo,
  rentVideo,
};
