const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const FaqTax = sequelize.define(
  "FaqTax",
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
    tableName: "faqTax",
  }
);

module.exports = FaqTax;
