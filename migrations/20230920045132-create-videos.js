"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Videos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      file: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      poster: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rented_amount: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      purchasing_amount: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      views: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      channelId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Channels",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Videos");
  },
};
