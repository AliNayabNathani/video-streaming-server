const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User");
const Video = require("./Video");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    video_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "video",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethodId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "usd",
    },

    status: {
      type: DataTypes.ENUM("succeeded", "failed", "processing", "pending"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "payment",
  }
);

// Payment.sync();

module.exports = Payment;
