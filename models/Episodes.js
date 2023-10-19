const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Video = require("./Video");

const Episode = sequelize.define(
  "Episode",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    views: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videoId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "video",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "episode",
  }
);

module.exports = Episode;
