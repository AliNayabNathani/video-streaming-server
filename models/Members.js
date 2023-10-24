const User = require("./User");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Member = sequelize.define("Member", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'member',
});

module.exports = Member;