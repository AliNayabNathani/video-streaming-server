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
});

module.exports = Role;
