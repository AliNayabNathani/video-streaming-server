const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Feedback = sequelize.define(
    "Feedback",
    {
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        videoId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "video",
                key: "id",
            },
        },
    },
    {
        tableName: "user_feedback",
    }
);

module.exports = Feedback;
