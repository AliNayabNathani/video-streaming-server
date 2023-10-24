const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Device = sequelize.define(
    "Device",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        os: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        location: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        }
    },
    {
        tableName: "device",
    }
);

module.exports = Device;