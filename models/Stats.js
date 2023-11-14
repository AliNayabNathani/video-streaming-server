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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    video_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "video",
        key: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    episode_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: "episode",
        key: "id",
        onDelete: "CASCADE", // ON DELETE CASCADE
        onUpdate: "CASCADE", // ON UPDATE CASCADE
      },
    },
    trailer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: "trailer",
        key: "id",
        onDelete: "CASCADE", // ON DELETE CASCADE
        onUpdate: "CASCADE", // ON UPDATE CASCADE
      },
    },
  },
  {
    tableName: "views_stats",
  }
);

module.exports = ViewsStats;
