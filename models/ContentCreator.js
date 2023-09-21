const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Channel = require("./Channel");
const User = require("./User");

const ContentCreator = sequelize.define(
  "ContentCreator",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_videos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    subscribers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("Active", "InActive", "Deleted", "Suspended"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "contentcreator",
  }
);

// ContentCreator.belongsTo(User, {
//   foreignKey: "user_id",
//   as: "user",
// });

ContentCreator.hasMany(Channel, {
  foreignKey: "content_creator_id",
  as: "channels",
});

module.exports = ContentCreator;
