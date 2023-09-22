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
      autoIncrement: true,
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
    tableName: "content_creator",
  }
);

ContentCreator.hasMany(Channel, {
  foreignKey: "content_creator_id",
  as: "channels",
});

// Function to update the total_videos count for a content creator
async function updateTotalVideos(contentCreatorId) {
  try {
    const contentCreator = await ContentCreator.findByPk(contentCreatorId);

    if (contentCreator) {
      const currentTotalVideos = contentCreator.total_videos;
      contentCreator.total_videos = currentTotalVideos + 1;
      await contentCreator.save();
      return contentCreator;
    }
  } catch (error) {
    console.error("Error updating total_videos:", error);
    throw error;
  }
}

// Usage example by Ali for later use:
// Call this function whenever a new video is added to a channel
// Pass the content creator's ID to updateTotalVideos
// For example:
// const contentCreatorId = 1; // Replace with the actual content creator's ID
// await updateTotalVideos(contentCreatorId);

module.exports = ContentCreator;
