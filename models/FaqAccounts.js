const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const FaqAccount = sequelize.define(
  "FaqAccount",
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
    tableName: "faqAccount",
  }
);

module.exports = FaqAccount;
