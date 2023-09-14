const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

module.exports = Role;
