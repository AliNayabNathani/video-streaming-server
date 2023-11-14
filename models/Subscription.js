const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User");
const Video = require("./Video");
const cron = require("node-cron");

const Subscription = sequelize.define(
  "Subscription",
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
      onDelete: "CASCADE",
    },
    video_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "video",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethodId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentPeriodStart: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    daysCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
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
      type: DataTypes.ENUM("active", "canceled", "inactive", "unpaid"),
      defaultValue: "inactive",
    },
  },
  {
    tableName: "subscription",
  }
);

// Subscription model
Subscription.belongsTo(Video, { foreignKey: "video_id", as: "video" });

Subscription.startCron = () => {
  // Schedule a job to run every day at a specific time (adjust as needed)
  cron.schedule("0 0 * * *", async () => {
    try {
      const expiredSubscriptions = await Subscription.findAll({
        where: {
          currentPeriodEnd: { [Op.lt]: new Date() },
          status: "active",
        },
      });

      if (expiredSubscriptions.length > 0) {
        await Subscription.update(
          { status: "inactive" },
          {
            where: {
              id: { [Op.in]: expiredSubscriptions.map((sub) => sub.id) },
            },
          }
        );

        console.log("Updated subscription statuses.");
      }
    } catch (error) {
      console.error("Error updating subscription statuses:", error);
    }
  });
};

Subscription.sync();

module.exports = Subscription;
