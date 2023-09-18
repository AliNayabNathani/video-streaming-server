const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");

const ContentCreator = sequelize.define(
    'ContentCreator',
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

module.exports = ContentCreator;
