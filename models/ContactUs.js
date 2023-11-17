const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const ContactUs = sequelize.define(
  "ContactUs",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mobile_number: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "contactus",
  }
);

module.exports = ContactUs;
