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
    episode_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: "episode",
        key: "id",
      },
    },
    trailer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: "trailer",
        key: "id",
      },
    },
  },
  {
    tableName: "views_stats",
  }
);

module.exports = ViewsStats;
