const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Channel = require("./Channel");

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
    file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    poster: {
      type: DataTypes.STRING,
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
        model: "channels",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "video",
  }
);

// Video.belongsTo(Channel, {
//   foreignKey: "channelId",
//   as: "channel",
// });
module.exports = Video;
