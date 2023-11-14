const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Coupon = sequelize.define(
  "Coupons",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      // primaryKey: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    max_value: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    max_redemptions: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "InActive"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "coupons",
  }
);

module.exports = Coupon;
