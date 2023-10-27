const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User");
const Video = require("./Video");

const Favourite = sequelize.define(
  "Favourite",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    videoId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Video,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "favourites",
  }
);

Favourite.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Favourite.belongsTo(Video, {
  foreignKey: "videoId",
  as: "video",
});

module.exports = Favourite;
