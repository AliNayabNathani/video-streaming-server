const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = sequelize.define("User", {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role_id: {
    type: DataTypes.BIGINT(20),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Active", "InActive", "Deleted", "Suspended"),
    defaultValue: "Active",
  },
  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
});
module.exports = User;
