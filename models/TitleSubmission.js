const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const TitleSubmission = sequelize.define(
  "TitleSubmission",
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
    tableName: "title_submission",
  }
);

// TitleSubmission.beforeCreate(async (account, options) => {
//   if (!account.description) {
//     if (account.name === "Title submission") {
//       account.description =
//         "This is the Title submission text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Licensing consideration and title review") {
//       account.description =
//         "This is the Licensing consideration and title review text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
//     } else if (account.name === "Submission requirements") {
//       account.description =
//         "This is the Submission requirements text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
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

// TitleSubmission.sync().then(() => {
//   TitleSubmission.create({ name: "Title submission" });
//   TitleSubmission.create({ name: "Licensing consideration and title review" });
//   TitleSubmission.create({ name: "Submission requirements" });
//   TitleSubmission.create({ name: "Available locations" });
//   TitleSubmission.create({ name: "Create a standalone title" });
//   TitleSubmission.create({ name: "Create an episode title" });
//   TitleSubmission.create({ name: "Add files from amazon S3" });
//   TitleSubmission.create({ name: "Categories" });
//   TitleSubmission.create({ name: "Genre defination" });
// });

module.exports = TitleSubmission;
