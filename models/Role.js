const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.BIGINT,
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
//   Role.create({ name: "Content Creator" });
// });

module.exports = Role;
