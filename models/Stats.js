const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const ViewsStats = sequelize.define(
  "ViewsStats",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    video_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "video",
        key: "id",
      },
    },
  },
  {
    tableName: "views_stats",
  }
);

module.exports = ViewsStats;
