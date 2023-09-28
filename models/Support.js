const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Support = sequelize.define(
  "Support",
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
    tableName: "support",
  }
);
// Support.beforeCreate(async (support, options) => {
//   console.log("beforeCreate hook triggered");
//   console.log("Name:", support.name);

//   if (!support.description) {
//     if (support.name === "Support") {
//       support.description =
//         "This is the Support text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     }
//   }

//   console.log("Description:", support.description);
// });

// Support.sync().then(() => {
//   Support.create({ name: "Support" });
// });

module.exports = Support;
