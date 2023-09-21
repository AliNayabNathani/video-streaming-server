const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User");
const Video = require("./Video");

const ContentApproval = sequelize.define(
  "ContentApproval",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    video_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Accept", "Reject"),
    },
  },
  {
    tableName: "content_approval",
  }
);

ContentApproval.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

ContentApproval.belongsTo(Video, {
  foreignKey: "video_id",
  as: "video",
});

module.exports = ContentApproval;
