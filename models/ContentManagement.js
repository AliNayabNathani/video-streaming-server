const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const ContentManagement = sequelize.define(
  "ContentManagement",
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
    tableName: "content_management",
  }
);

ContentManagement.beforeCreate(async (content, options) => {
  console.log("beforeCreate hook triggered");
  console.log("Name:", content.name);

  if (!content.description) {
    if (content.name === "Terms And Conditions") {
      content.description =
        "This is the Terms and Conditions text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
    } else if (content.name === "Privacy Policy") {
      content.description =
        "This is the Privacy Policy text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
    } else if (content.name === "About Us") {
      content.description =
        "This is the About Us text. Lorem ipsum dolor sit amet consectetur, adipisicing elit...";
    }
  }

  console.log("Description:", content.description);
});

// ContentManagement.sync().then(() => {
//   ContentManagement.create({ name: "Terms And Conditions" });
//   ContentManagement.create({ name: "Privacy Policy" });
//   ContentManagement.create({ name: "About Us" });
// });

module.exports = ContentManagement;
