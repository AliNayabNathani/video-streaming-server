const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const FAQ = sequelize.define(
  "FAQ",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    questions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answers: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "faqs",
  }
);

module.exports = FAQ;
