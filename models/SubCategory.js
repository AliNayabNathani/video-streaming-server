const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Category = require("./Category");

const SubCategory = sequelize.define(
  "SubCategory",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.BIGINT,
      defaultValue: 1,
      references: {
        model: Category,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "sub-category",
  }
);

module.exports = SubCategory;
