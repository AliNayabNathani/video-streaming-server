const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Channel = require("./Channel");
const Trailer = require("./Trailer");
const Episode = require("./Episodes");
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
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    purchasing_amount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    views: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  },
  {
    tableName: "video",
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

Video.prototype.getChannelDetails = async function () {
  try {
    const videoDetails = await Channel.findByPk(this.channelId);
    return videoDetails;
  } catch (error) {
    console.error("Error fetching associated Channel:", error);
    throw error;
  }
};

module.exports = Video;
