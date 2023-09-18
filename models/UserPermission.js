const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const UserPermission = sequelize.define(
  "UserPermission",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    permission_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "permissions",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "user_permissions",
  }
);

module.exports = UserPermission;
