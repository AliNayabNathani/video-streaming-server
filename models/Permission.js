const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Permission = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    module_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "modules",
        key: "id",
      },
    },
  },
  {
    tableName: "permissions",
  }
);

module.exports = Permission;
