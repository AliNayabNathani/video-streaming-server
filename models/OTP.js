const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const OTP = sequelize.define("OTP", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = OTP;
