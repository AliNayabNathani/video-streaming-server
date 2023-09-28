const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Overview = sequelize.define(
  "Overview",
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
    tableName: "overview",
  }
);
// Overview.beforeCreate(async (overview, options) => {
//   if (!overview.description) {
//     if (overview.name === "Overview") {
//       overview.description =
//         "This is the overview text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     }
//   }
// });

// Overview.sync().then(() => {
//   Overview.create({ name: "Overview" });
// });

module.exports = Overview;
