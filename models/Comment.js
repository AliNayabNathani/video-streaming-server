const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User"); // Assuming you have a User model

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    videoId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
  }
);

Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Comment, {
  foreignKey: "userId",
  as: "comments",
});

// Comment.belongsTo(Video, {
//   foreignKey: "videoId",
//   as: "video",
// });

// Video.hasMany(Comment, {
//   foreignKey: "videoId",
//   as: "comments",
// });
module.exports = Comment;
