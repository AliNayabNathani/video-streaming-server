const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const ChangeTitle = sequelize.define(
  "ChangeTitle",
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
    tableName: "change_title",
  }
);

// ChangeTitle.beforeCreate(async (account, options) => {
//   if (!account.description) {
//     if (account.name === "Add or remove seasons & episodes") {
//       account.description =
//         "This is the Add or remove seasons & episodes text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (
//       account.name ===
//       "Change location availability, pricing model, or availability dates"
//     ) {
//       account.description =
//         "This is the Change location availability, pricing model, or availability dates text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Change titles") {
//       account.description =
//         "This is the Change titles text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Available locations") {
//       account.description =
//         "This is the Available locations text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Create a standalone title") {
//       account.description =
//         "This is the Create a standalone title text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Create an episode title") {
//       account.description =
//         "This is the Create an episode title text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Add files from amazon S3") {
//       account.description =
//         "This is the Add files from amazon S3. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Categories") {
//       account.description =
//         "This is the Categories text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Genre defination") {
//       account.description =
//         "This is the Genre defination text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     }
//   }
// });

// ChangeTitle.sync().then(() => {
//   ChangeTitle.create({ name: "Change titles" });
//   ChangeTitle.create({ name: "Add or remove seasons & episodes" });
//   ChangeTitle.create({
//     name: "Change location availability, pricing model, or availability dates",
//   });
//   ChangeTitle.create({ name: "Available locations" });
//   ChangeTitle.create({ name: "Create a standalone title" });
//   ChangeTitle.create({ name: "Create an episode title" });
//   ChangeTitle.create({ name: "Add files from amazon S3" });
//   ChangeTitle.create({ name: "Categories" });
//   ChangeTitle.create({ name: "Genre defination" });
// });

module.exports = ChangeTitle;
