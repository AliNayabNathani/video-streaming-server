const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "roles",
  }
);

// Role.sync().then(() => {
//   Role.create({ name: "Admin" });
//   Role.create({ name: "User" });
//   Role.create({ name: "Moderator" });
// });

module.exports = Role;
