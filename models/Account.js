const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Account = sequelize.define(
  "Account",
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
      defaultValue: "",
    },
  },
  {
    tableName: "account",
  }
);

// Account.beforeCreate(async (account, options) => {
//   if (!account.description) {
//     if (account.name === "Setup Account") {
//       account.description =
//         "This is the Setup Account text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Company Profile") {
//       account.description =
//         "This is the Company Profile text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "User Roles") {
//       account.description =
//         "This is the User Roles text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Account") {
//       account.description =
//         "This is the Account text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     }
//   }
// });

// Account.sync().then(() => {
//   Account.create({ name: "Account" });
//   Account.create({ name: "Setup Account" });
//   Account.create({ name: "Company Profile" });
//   Account.create({ name: "User Roles" });
// });

module.exports = Account;
