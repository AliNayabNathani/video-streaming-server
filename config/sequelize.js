const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "dpg-ckhp3a6afg7c73frctsg-a.oregon-postgres.render.com",
  port: 5432,
  username: "videodb_jkqb_user",
  password: "x79U393nDALkG7WcjlF4OvpVlea3usW9",
  database: "videodb_jkqb",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
