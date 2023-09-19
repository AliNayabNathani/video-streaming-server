const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");

const Channel = sequelize.define(
    'Channel',
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        creator_name: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: "channel",
    }
);

module.exports = Channel;
