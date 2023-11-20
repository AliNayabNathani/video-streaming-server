const User = require("../models/User");
const Role = require("../models/Role");
const Feedback = require("../models/Feedback");
const ContentCreator = require("../models/ContentCreator");
const Trailer = require("../models/Trailer");
const Episode = require("../models/Episodes");
const Channel = require("../models/Channel");
const Support = require("../models/Support");
const json2csv = require("json2csv");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Video = require("../models/Video");
const ContentApproval = require("../models/ContentApproval");
const { Op } = require("sequelize");
const sequelize = require("../config/sequelize");
const { uploadVideo, uploadVideoPoster } = require("./otherController");
const recordView = require("../utils/recordViews");
const ContentManagement = require("../models/ContentManagement");
const FAQ = require("../models/FAQs");
const FaqAccount = require("../models/FaqAccounts");
const FaqTax = require("../models/FaqTax");
const Overview = require("../models/Overview");
const ContactUs = require("../models/ContactUs");

const MyVideos = async (req, res) => {
  const userId = req.user.userId;

  const contentCreator = await ContentCreator.findOne({
    where: {
      user_id: userId,
    },
  });

  if (!contentCreator) {
    throw new CustomError.NotFoundError(`User is not a content creator.`);
  }

  const contentCreatorId = contentCreator.id;

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

  const video = await Video.findByPk(videoId, {
    include: [
      { model: Trailer, as: "trailers" },
      { model: Episode, as: "episodes" },
    ],
  });

  if (!video) {
    throw new CustomError.NotFoundError(`Video not found.`);
  }
  const episodeId = 0;
  const trailerId = 0;
  // recordView(req.user.userId, videoId, episodeId, trailerId);

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

  res
    .status(StatusCodes.OK)
    .json({ message: "Video status updated successfully." });
};

const addNewVideo = async (req, res) => {
  console.log(req);
  const {
    title,
    rented_amount,
    purchasing_amount,
    Genre,
    description,
    Cast,
    Type,
    channelId,
    category,
    trailers: trailersData,
    episodes: episodesData,
  } = req.body;
  // const trailer = JSON.parse(filteredTrailers); // Parse the JSON string back to an object
  // const episode = JSON.parse(filteredEpisodes);

  const requiredFields = [
    "title",
    "rented_amount",
    "purchasing_amount",
    "Genre",
    "description",
    "Cast",
    "Type",
    "channelId",
    "trailers",
    "episodes",
    "category",
  ];
  const missingFields = requiredFields.filter((field) => !(field in req.body));

  if (missingFields.length > 0) {
    throw new CustomError.BadRequestError(
      `Fill All Fields. Missing Fields: ${missingFields.join(", ")}`
    );
  }

  const video = await Video.create({
    name: title || "Video Title",
    description,
    rented_amount,
    purchasing_amount,
    channelId,
    Type,
    Cast,
    Genre,
    category,
  });

  if (Array.isArray(trailersData)) {
    for (const trailerData of trailersData) {
      const trailer = await Trailer.create({
        title: trailerData.title || "Episode Title",
        file: trailerData.trailerVideo,
        poster: trailerData.trailerPoster,
        videoId: video.id,
      });
    }
  } else {
    const trailer = await Trailer.create({
      title: trailersData.title || "Trailer Title",
      file: trailersData.trailerVideo,
      poster: trailersData.trailerPoster,
      videoId: video.id,
    });
  }

  if (Array.isArray(episodesData)) {
    for (const episodeData of episodesData) {
      await Episode.create({
        title: episodeData.title || "Episode Title",
        file: episodeData.episodeVideo,
        poster: episodeData.poster,
        description: episodeData.description || null,
        videoId: video.id,
      });
    }
  } else {
    await Episode.create({
      title: episodesData.title || "Episode Title",
      file: episodesData.episodeVideo,
      poster: episodesData.poster,
      description: episodesData.description || null,
      videoId: video.id,
    });
  }

  res
    .status(StatusCodes.CREATED)
    .json({ video, trailers: trailersData, episodes: episodesData });
};

const addNewEpisodeToVideo = async (req, res) => {
  console.log("HERE");
  const { id: videoId } = req.params;
  // console.log(videoId);
  const { title, file, poster, description } = req.body;

  const video = await Video.findByPk(videoId);
  console.log("videoId im here", video.id);
  const episode = await Episode.create({
    title,
    file,
    poster: poster || null,
    description: description || null,
    videoId: video.id,
  });

  res.status(StatusCodes.CREATED).json({ episode });
};

const deleteEpisode = async (req, res) => {
  const { id: episodeId } = req.params;

  if (!episodeId) {
    throw new CustomError.BadRequestError(
      "Episode ID is required for deletion."
    );
  }

  const episode = await Episode.findByPk(episodeId);

  if (!episode) {
    throw new CustomError.NotFoundError("Episode not found.");
  }
  await episode.destroy();

  res.status(StatusCodes.OK).json({ msg: "Episode deleted successfully." });
};

const addNewTrailerToVideo = async (req, res) => {
  const { id: videoId } = req.params;
  const { title, file, poster } = req.body;

  const video = await Video.findByPk(videoId);
  // console.log("videoId im here", video.id);
  const trailer = await Trailer.create({
    title,
    file,
    poster: poster || null,
    videoId: video.id,
  });

  res.status(StatusCodes.CREATED).json({ trailer });
};

const getMyChannels = async (req, res) => {
  const userId = req.user.userId;
  const contentCreator = await ContentCreator.findOne({
    where: {
      user_id: userId,
    },
  });

  if (!contentCreator) {
    throw new CustomError.NotFoundError(`User is not a content creator.`);
  }
  const contentCreatorId = contentCreator.id;

  const channels = await Channel.findAll({
    where: { content_creator_id: contentCreatorId },
    attributes: ["id", "name", "content_creator_id", "createdAt"],
    include: [
      {
        model: Video,
        as: "videos",
        attributes: ["id", "name", "views", "Type"],
        include: [
          {
            model: Trailer,
            as: "trailers",
            attributes: ["id", "poster", "file", "title"],
          },
          {
            model: Episode,
            as: "episodes",
            attributes: ["id", "poster", "file", "title", "description"],
          },
        ],
      },
    ],
  });

  if (!channels || channels.length === 0) {
    throw new CustomError.NotFoundError(
      `No channels found for the current user.`
    );
  }

  const channelCount = channels.length;

  res.status(StatusCodes.OK).json({ channels, channelCount });
};

const getSingleChannelDetail = async (req, res) => {
  const { id: channelId } = req.params;

  const channel = await Channel.findByPk(channelId, {
    include: [
      {
        model: Video,
        as: "videos",
        attributes: ["id", "name", "views", "Type"],
        include: [
          {
            model: Trailer,
            as: "trailers",
            attributes: ["id", "poster", "file", "title"],
          },
          {
            model: Episode,
            as: "episodes",
            attributes: ["id", "title", "description", "file", "poster"],
          },
        ],
      },
    ],
  });

  if (!channel) {
    throw new CustomError.NotFoundError(
      `Channel with ID ${channelId} not found.`
    );
  }

  const episodeCount = channel.videos.reduce((total, video) => {
    return total + video.episodes.length;
  }, 0);

  res.status(StatusCodes.OK).json({ channel, episodeCount });
};

const createNewChannel = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;
  console.log(userId);
  const contentCreator = await ContentCreator.findOne({
    where: {
      user_id: userId,
    },
  });
  console.log(contentCreator);
  if (!contentCreator) {
    throw new CustomError.NotFoundError(`User is not a content creator.`);
  }
  const content_creator_id = contentCreator.dataValues.id;

  if (!name || !content_creator_id) {
    throw new CustomError.BadRequestError(
      "Name and content_creator_id are required for creating a channel"
    );
  }

  const existingChannel = await Channel.findOne({
    where: {
      name,
    },
  });

  if (existingChannel) {
    throw new CustomError.BadRequestError(
      `Channel with name '${name}' already exists.`
    );
  }

  const channel = await Channel.create({
    name,
    content_creator_id,
  });

  res.status(StatusCodes.CREATED).json({ channel });
};

const createNewChannelWithEpisodes = async (req, res) => {
  const { name, episodes } = req.body;
  const userId = req.user.userId;
  const contentCreator = await ContentCreator.findOne({
    where: {
      user_id: userId,
    },
  });
  console.log(contentCreator);
  if (!contentCreator) {
    throw new CustomError.NotFoundError("Not Found.");
  }

  const channel = await Channel.create({
    name,
    content_creator_id: contentCreator.id,
  });

  if (Array.isArray(episodes) && episodes.length > 0) {
    const createdEpisodes = await Episode.bulkCreate(
      episodes.map((episode) => ({
        title: episode.title || "Episode Title",
        file: episode.file,
        poster: episode.poster || null,
        description: episode.description || null,
        videoId: channel.id,
      }))
    );
    channel.addEpisodes(createdEpisodes);
  }

  res.status(StatusCodes.CREATED).json({ channel });
};

const deleteChannel = async (req, res) => {
  const { id: channelId } = req.params;

  if (!channelId) {
    throw new CustomError.BadRequestError(
      "Channel ID is required for deletion."
    );
  }

  const channel = await Channel.findByPk(channelId);

  if (!channel) {
    throw new CustomError.NotFoundError("Channel not found.");
  }

  await channel.destroy();

  res.status(StatusCodes.OK).json({ msg: "Channel deleted successfully." });
};

// const createNewChannelWithEpisodes = async (req, res) => {
//     const { name, episodes } = req.body;
//     const content_creator_id = 4;

//     if (!name || !content_creator_id) {
//       throw new CustomError.BadRequestError('Name and content_creator_id are required for creating a channel');
//     }

//     const channel = await Channel.create({
//       name,
//       content_creator_id,
//     });

//     if (Array.isArray(episodes) && episodes.length > 0) {
//       const createdEpisodes = await Episode.bulkCreate(
//         episodes.map((episode) => ({
//           title: episode.title || 'Episode Title',
//           file: episode.file,
//           poster: episode.poster || null,
//           description: episode.description || null,
//           videoId: channel.id,
//         }))
//       );

//       const video = await Video.create({ channelId: channel.id });
//       await video.addEpisodes(createdEpisodes);
//     }

//     res.status(StatusCodes.CREATED).json({ channel });
//   };

const submitFeedback = async (req, res) => {
  const userId = req.user.userId; //req.user after auth kardena
  const { id: videoId } = req.params;
  const { rating, comment } = req.body;

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

const getSupport = async (req, res) => {
  const supportItem = await Support.findOne({
    where: { name: "Support" },
  });
  const supportData = supportItem.description;

  res.status(StatusCodes.OK).json({ supportData });
};

const updateSupport = async (req, res) => {
  const updatedDescription = req.body.updatedDescription;

  const [overviewItem, created] = await Support.findOrCreate({
    where: { name: "Support" },
    defaults: { description: updatedDescription },
  });

  if (!overviewItem) {
    throw new CustomError.NotFoundError("Support Not Found");
  }

  if (!created) {
    overviewItem.description = updatedDescription;
    await overviewItem.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Support Data updated successfully." });
};

const updateOverview = async (req, res) => {
  const updatedDescription = req.body.updatedDescription;

  const [overviewItem, created] = await Overview.findOrCreate({
    where: { name: "Overview" },
    defaults: { description: updatedDescription },
  });

  if (!overviewItem) {
    throw new CustomError.NotFoundError("Overview Not Found");
  }

  if (!created) {
    overviewItem.description = updatedDescription;
    await overviewItem.save();
  }

  res.status(StatusCodes.OK).json({ msg: "Overview Updated Successfully" });
};

const getOverview = async (req, res) => {
  const overviewItem = await Overview.findOne({
    where: { name: "Overview" },
  });
  const overView = overviewItem.description;

  res.status(StatusCodes.OK).json({ overView });
};

const updateContentPolicy = async (req, res) => {
  const updatedDescription = req.body.updatedDescription;

  const [contentPolicyItem, created] = await ContentManagement.findOrCreate({
    where: { name: "Content Policy" },
    defaults: { description: updatedDescription },
  });

  if (!contentPolicyItem) {
    throw new CustomError.NotFoundError("Overview Not Found");
  }

  if (!created) {
    contentPolicyItem.description = updatedDescription;
    await overviewItem.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Content Policy Updated Successfully" });
};

const getContentPolicy = async (req, res) => {
  const contentPolicyItem = await ContentManagement.findOne({
    where: { name: "Content Policy" },
  });

  const contentPolicy = contentPolicyItem.description;

  res.status(StatusCodes.OK).json({ contentPolicy });
};

const updateCopyright = async (req, res) => {
  const updatedDescription = req.body.updatedDescription;

  const [copyrightAndTrademarkItem, created] =
    await ContentManagement.findOrCreate({
      where: { name: "Copyright And Trademark" },
      defaults: { description: updatedDescription },
    });

  if (!copyrightAndTrademarkItem) {
    throw new CustomError.NotFoundError("Copyright And Trademark Not Found");
  }

  if (!created) {
    copyrightAndTrademarkItem.description = updatedDescription;
    await copyrightAndTrademarkItem.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Copyright And Trademark Updated Successfully" });
};

const getSingleEpisode = async (req, res) => {
  const { id: episodeId } = req.params;

  const episode = await Episode.findByPk(episodeId);
  if (!episode) {
    throw new CustomError.NotFoundError(`No Episode with id: ${episodeId}`);
  }
  const trailerId = null;
  await recordView(req.user.userId, episode.videoId, trailerId, episode.id);

  res.status(StatusCodes.OK).json({ episode });
};

const getSingleTrailer = async (req, res) => {
  const { id: trailerId } = req.params;
  const { userId } = req.body;
  const trailer = await Trailer.findByPk(trailerId);

  if (!trailer) {
    throw new CustomError.NotFoundError(`No Trailer with id: ${trailerId}`);
  }

  const episodeId = 0;
  await recordView(userId, trailer.videoId, trailer.id, episodeId);

  res.status(StatusCodes.OK).json({ trailer });
};

const updateFAQ = async (req, res) => {
  const faqUpdates = req.body;

  if (!Array.isArray(faqUpdates)) {
    throw new CustomError.BadRequestError("Invalid request body format");
  }

  const updatePromises = faqUpdates.map(async (update) => {
    const { questions, answers } = update;

    const [faqItem, created] = await FAQ.findOrCreate({
      where: { questions: questions },
      defaults: { answers: answers },
    });

    if (!faqItem) {
      throw new CustomError.NotFoundError(
        `FAQ for Submissions question "${questions}" not found`
      );
    }

    if (!created) {
      // FAQ already exists, update the answers (DONT REMOVE MY COMMENTS :@)
      faqItem.answers = answers;
      await faqItem.save();
    }
  });

  try {
    await Promise.all(updatePromises);
    res.status(StatusCodes.OK).json({ msg: "FAQs Updated Successfully" });
  } catch (error) {
    console.error("Error updating FAQs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getFAQ = async (req, res) => {
  const allFAQ = await FAQ.findAll();

  if (!allFAQ || allFAQ.length === 0) {
    throw new NotFoundError("No FAQs for Submissions found");
  }

  const faqData = allFAQ.map((faq) => ({
    questions: faq.questions,
    answers: faq.answers,
  }));

  res.status(StatusCodes.OK).json({ faq: faqData });
};

const updateFAQAccount = async (req, res) => {
  const faqUpdates = req.body;

  if (!Array.isArray(faqUpdates)) {
    throw new CustomError.BadRequestError("Invalid request body format");
  }

  const updatePromises = faqUpdates.map(async (update) => {
    const { questions, answers } = update;

    const [faqItem, created] = await FaqAccount.findOrCreate({
      where: { questions: questions },
      defaults: { answers: answers },
    });

    if (!faqItem) {
      throw new CustomError.NotFoundError(
        `FAQ for Account question "${questions}" not found`
      );
    }

    if (!created) {
      // FAQ already exists, update the answers (DONT REMOVE MY COMMENTS :@)
      faqItem.answers = answers;
      await faqItem.save();
    }
  });

  try {
    await Promise.all(updatePromises);
    res
      .status(StatusCodes.OK)
      .json({ msg: "FAQs Account Updated Successfully" });
  } catch (error) {
    console.error("Error updating FAQs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getFAQAccount = async (req, res) => {
  const allFAQ = await FaqAccount.findAll();

  if (!allFAQ || allFAQ.length === 0) {
    throw new NotFoundError("No FAQs for Account found");
  }

  const faqData = allFAQ.map((faq) => ({
    questions: faq.questions,
    answers: faq.answers,
  }));

  res.status(StatusCodes.OK).json({ FaqAccounts: faqData });
};

const updateFAQTax = async (req, res) => {
  const faqUpdates = req.body;

  if (!Array.isArray(faqUpdates)) {
    throw new CustomError.BadRequestError("Invalid request body format");
  }

  const updatePromises = faqUpdates.map(async (update) => {
    const { questions, answers } = update;

    const [faqItem, created] = await FaqTax.findOrCreate({
      where: { questions: questions },
      defaults: { answers: answers },
    });

    if (!faqItem) {
      throw new CustomError.NotFoundError(
        `FAQ for Tax question "${questions}" not found`
      );
    }

    if (!created) {
      // FAQ already exists, update the answers (DONT REMOVE MY COMMENTS :@)
      faqItem.answers = answers;
      await faqItem.save();
    }
  });

  try {
    await Promise.all(updatePromises);
    res.status(StatusCodes.OK).json({ msg: "FAQs Updated Successfully" });
  } catch (error) {
    console.error("Error updating FAQs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getFaqTax = async (req, res) => {
  const allFAQ = await FaqTax.findAll();

  if (!allFAQ || allFAQ.length === 0) {
    throw new NotFoundError("No FAQs for Tax found");
  }

  const faqData = allFAQ.map((faq) => ({
    questions: faq.questions,
    answers: faq.answers,
  }));

  res.status(StatusCodes.OK).json({ FaqTax: faqData });
};

const updateContactUs = async (req, res) => {
  const { description, mobile_number, fax, email, address } = req.body;

  const [contactUsItem, created] = await ContactUs.findOrCreate({
    where: { id: 1 },
    defaults: {
      description,
      mobile_number,
      fax,
      email,
      address,
    },
  });

  if (!contactUsItem || (created && !contactUsItem)) {
    throw new CustomError.NotFoundError("ContactUs Not Found");
  }

  if (!created) {
    contactUsItem.description = description;
    contactUsItem.mobile_number = mobile_number;
    contactUsItem.fax = fax;
    contactUsItem.email = email;
    contactUsItem.address = address;
    await contactUsItem.save();
  }

  res.status(StatusCodes.OK).json({ msg: "ContactUs Updated Successfully" });
};

const getContactUs = async (req, res) => {
  const contactUsItem = await ContactUs.findOne({
    where: { id: 1 },
  });

  if (!contactUsItem) {
    throw new CustomError.NotFoundError("ContactUs Not Found");
  }

  res.status(StatusCodes.OK).json({ contactUsItem });
};

module.exports = {
  MyVideos,
  getMyChannels,
  getSingleMyVideo,
  changeVideoStatus,
  addNewVideo,
  submitFeedback,
  getSingleChannelDetail,
  createNewChannel,
  getSupport,
  updateSupport,
  deleteChannel,
  addNewEpisodeToVideo,
  addNewTrailerToVideo,
  deleteEpisode,
  createNewChannelWithEpisodes,
  getSingleEpisode,
  getSingleTrailer,
  getOverview,
  updateOverview,
  getContentPolicy,
  updateContentPolicy,
  updateCopyright,
  updateFAQ,
  getFAQ,
  updateFAQAccount,
  getFAQAccount,
  updateFAQTax,
  getFaqTax,
  updateContactUs,
  getContactUs,
};
