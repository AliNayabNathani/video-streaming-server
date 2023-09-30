const { Op, QueryTypes } = require("sequelize");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const sequelize = require("../config/sequelize");
const CustomError = require("../errors");
const ContentCreator = require("../models/ContentCreator");
const Video = require("../models/Video");
const Channel = require("../models/Channel");
const moment = require("moment");

function getMonthName(monthNumber) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNumber - 1];
}

//Admin Graphs
const getUsersRegisteredByMonth = async (req, res) => {
  const monthlyData = [];

  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    const userCount = await User.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const monthData = {
      name: getMonthName(month),
      pv: userCount,
    };

    monthlyData.push(monthData);
  }
  const totalUsers = await User.count();

  // Calculate the number of users registered in the current month
  const currentDate = new Date();
  const currentMonthStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const currentMonthEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const usersThisMonth = await User.count({
    where: {
      createdAt: {
        [Op.between]: [currentMonthStartDate, currentMonthEndDate],
      },
    },
  });

  res.status(StatusCodes.OK).json({ monthlyData, totalUsers, usersThisMonth });
};

const getCreatorsRegisteredByMonth = async (req, res) => {
  const monthlyData = [];

  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    const userCount = await ContentCreator.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const monthData = {
      name: getMonthName(month),
      pv: userCount,
    };

    monthlyData.push(monthData);
  }

  const totalCreators = await ContentCreator.count();

  // Calculate the number of users registered in the current month
  const currentDate = new Date();
  const currentMonthStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const currentMonthEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const creatorsThisMonth = await ContentCreator.count({
    where: {
      createdAt: {
        [Op.between]: [currentMonthStartDate, currentMonthEndDate],
      },
    },
  });

  res
    .status(StatusCodes.OK)
    .json({ monthlyData, totalCreators, creatorsThisMonth });
};

const getTotalVideos = async (req, res) => {
  //For Videos
  const totalVideos = await Video.count();

  const currentDate = new Date();
  const currentMonthStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const currentMonthEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const videosThisMonth = await Video.count({
    where: {
      createdAt: {
        [Op.between]: [currentMonthStartDate, currentMonthEndDate],
      },
    },
  });

  //For Movies
  const totalMovies = await Video.count({
    where: {
      Type: "Movie",
    },
  });

  const moviesThisMonth = await Video.count({
    where: {
      Type: "Movie",
      createdAt: {
        [Op.between]: [currentMonthStartDate, currentMonthEndDate],
      },
    },
  });

  //For Series
  const totalSeries = await Video.count({
    where: {
      Type: "Series",
    },
  });

  const seriesThisMonth = await Video.count({
    where: {
      Type: "Series",
      createdAt: {
        [Op.between]: [currentMonthStartDate, currentMonthEndDate],
      },
    },
  });

  res.status(StatusCodes.OK).json({
    totalVideos,
    videosThisMonth,
    totalMovies,
    moviesThisMonth,
    totalSeries,
    seriesThisMonth,
  });
};

//Client Graphs
const getTotalViewsForUser = async (req, res) => {
  // const { id: userId } = req.user;

  const userId = 3;

  const contentCreator = await ContentCreator.findOne({
    where: {
      user_id: userId,
    },
    attributes: ["id"],
  });

  if (!contentCreator) {
    throw new CustomError.NotFoundError("User is Not A Content Creator.");
  }

  const channels = await Channel.findAll({
    where: {
      content_creator_id: contentCreator.id,
    },
    attributes: ["id"],
  });

  if (!channels || channels.length === 0) {
    throw new CustomError.NotFoundError("User Has No Channel.");
  }

  const videoViews = await Video.sum("views", {
    where: {
      channelId: channels.map((channel) => channel.id),
    },
  });

  res.status(StatusCodes.OK).json({ totalViews: videoViews || 0 });
};

const calculateTotalViewsForUser = async (userId, interval) => {
  const contentCreator = await ContentCreator.findOne({
    where: {
      user_id: userId,
    },
  });

  if (!contentCreator) {
    return [];
  }

  const channels = await Channel.findAll({
    where: {
      content_creator_id: contentCreator.id,
    },
  });

  if (!channels || channels.length === 0) {
    return [];
  }

  const channelIds = channels.map((channel) => channel.id);

  const currentDate = new Date();
  let dateGenerator;

  switch (interval) {
    case "daily":
      dateGenerator = (index) =>
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - index
        );
      break;
    case "weekly":
      dateGenerator = (index) =>
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - index * 7
        );
      break;
    case "monthly":
      dateGenerator = (index) =>
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - index,
          currentDate.getDate()
        );
      break;
    case "yearly":
      dateGenerator = (index) =>
        new Date(
          currentDate.getFullYear() - index,
          currentDate.getMonth(),
          currentDate.getDate()
        );
      break;

    default:
      dateGenerator = (index) => {
        const startDate = new Date();
        startDate.setDate(currentDate.getDate() - index);
        return startDate;
      };
  }
  const data = [];
  for (let i = 0; i < 7; i++) {
    const endIntervalDate = dateGenerator(i);
    const startIntervalDate = dateGenerator(i + 1);

    const views = await Video.findOne({
      attributes: [[sequelize.fn("SUM", sequelize.col("views")), "totalViews"]],
      where: {
        channelId: channelIds,
        createdAt: {
          [Op.between]: [startIntervalDate, endIntervalDate],
        },
      },
      raw: true,
    });

    data.push({
      startInterval: startIntervalDate.toISOString().split("T")[0],
      endInterval: endIntervalDate.toISOString().split("T")[0],
      views: views ? views.totalViews || 0 : 0,
    });
  }

  return data;
};
const getViewsGraph = async (req, res) => {
  const userId = req.user.userId;
  // console.log("curr user", userId);
  const intervals = ["daily", "weekly", "monthly", "yearly"];

  const viewsByInterval = {};

  for (const interval of intervals) {
    const viewsData = await calculateTotalViewsForUser(userId, interval);
    viewsByInterval[interval] = viewsData;
  }

  res.status(StatusCodes.OK).json({ viewsByInterval });
};

module.exports = {
  getUsersRegisteredByMonth,
  getCreatorsRegisteredByMonth,
  getTotalVideos,
  getTotalViewsForUser,
  getViewsGraph,
};
