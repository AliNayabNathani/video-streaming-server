const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Channel = require("./Channel");
const Trailer = require("./Trailer");
const Episode = require("./Episodes");
const Subscription = require("./Subscription");
const Payment = require("./Payment");
const ViewsStats = require("./Stats");

const Video = sequelize.define(
  "Video",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rented_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    purchasing_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    views: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    channelId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "channel",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Cast: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Active",
        "InActive",
        "Rejected",
        "Pending",
        "Deleted"
      ),
      defaultValue: "Pending",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // language: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    //   defaultValue: "English",
    // },
  },
  {
    tableName: "video",
    timestamps: true,
  }
);

Video.hasMany(Trailer, {
  foreignKey: "videoId",
  as: "trailers",
});

Video.hasMany(Episode, {
  foreignKey: "videoId",
  as: "episodes",
});

// Video.hasMany(Subscription, {
//   foreignKey: "video_id",
//   as: "subscriptions",
// });

Video.hasMany(Payment, {
  foreignKey: "video_id",
  as: "payments",
});

Video.prototype.getChannelDetails = async function () {
  try {
    const videoDetails = await Channel.findByPk(this.channelId);
    return videoDetails;
  } catch (error) {
    console.error("Error fetching associated Channel:", error);
    throw error;
  }
};

Video.sync();

module.exports = Video;
