const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");

const Category = sequelize.define(
    'Category',
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
        desc: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: "category",
    });

module.exports = Category;
