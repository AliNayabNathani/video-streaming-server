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
        model: "contentcreator",
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

// Channel.belongsTo(ContentCreator, {
//   foreignKey: "content_creator_id",
//   as: "content_creator",
// });

Channel.hasMany(Video, {
  foreignKey: "channelId",
  as: "videos",
});

module.exports = Channel;
