const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
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
  },
  {
    tableName: "users",
  }
);

User.beforeCreate(async (user, options) => {
  if (user.changed("password")) {
    // console.log("Before hashing - user.password:", user.password);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // console.log("After hashing - user.password:", user.password);
  }
});

User.prototype.comparePassword = async function (candidatePassword) {
  const isMatch = candidatePassword === this.password;

  console.log("Comparing passwords:");
  console.log("candidatePassword:", candidatePassword);
  console.log("this.password:", this.password);
  console.log("isMatch:", isMatch);

  return isMatch;
};

console.log("HERE ", User === sequelize.models.User);
module.exports = User;
