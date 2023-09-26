const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const BankAndTax = sequelize.define(
  "BankAndTax",
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
    tableName: "bank_and_tax",
  }
);

// BankAndTax.beforeCreate(async (account, options) => {
//   if (!account.description) {
//     if (account.name === "Bank and tax information") {
//       account.description =
//         "This is the Bank and tax information text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Banking information") {
//       account.description =
//         "This is the Banking information text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Tax info") {
//       account.description =
//         "This is the Tax info text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "European content acquisition") {
//       account.description =
//         "This is the European content acquisition text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Billing preference") {
//       account.description =
//         "This is the User Roles text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     }
//   }
// });

// BankAndTax.sync().then(() => {
//   BankAndTax.create({ name: "Bank and tax information" });
//   BankAndTax.create({ name: "Banking information" });
//   BankAndTax.create({ name: "Tax info" });
//   BankAndTax.create({ name: "European content acquisition" });
//   BankAndTax.create({ name: "Billing preference" });
// });

module.exports = BankAndTax;
