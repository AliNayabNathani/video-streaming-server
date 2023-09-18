const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Module = sequelize.define(
  "Module",
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
    },
    class: {
      type: DataTypes.STRING,
      defaultValue: "Admin",
    },
  },
  {
    tableName: "modules",
  }
);

// Module.sync()
//   .then(async () => {
//     Module.create({ name: "Dashboard" });
//     Module.create({ name: "User Management" });
//     Module.create({ name: "Content Creator Management" });
//     Module.create({ name: "Category Management" });
//     Module.create({ name: "Channels Management" });
//     Module.create({ name: "Videos Management" });
//     Module.create({ name: "Content Approval Management" });
//     Module.create({ name: "Coupons Management" });
//     Module.create({ name: "Packages Management" });
//     Module.create({ name: "Cotent Management" });
//     Module.create({ name: "Reports" });
//     Module.create({ name: "Cutsom Push Notifications" });
//   })
//   .catch((error) => {
//     console.error("Error creating modules:", error);
//   });

module.exports = Module;
