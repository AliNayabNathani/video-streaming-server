const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Video = require("./Video");
const ContentCreator = require("./ContentCreator");

const Channel = sequelize.define(
  "Channel",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content_creator_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "content_creator",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("Active", "InActive", "Deleted", "Suspended"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "channel",
  }
);

Channel.hasMany(Video, {
  foreignKey: "channelId",
  as: "videos",
});

Channel.prototype.getContentCreator = async function () {
  try {
    const contentCreator = await ContentCreator.findByPk(
      this.content_creator_id
    );
    return contentCreator;
  } catch (error) {
    console.error("Error fetching associated ContentCreator:", error);
    throw error;
  }
};

module.exports = Channel;
