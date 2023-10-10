const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "dpg-ckhp3a6afg7c73frctsg-a",
  port: 5432,
  username: "videeodb_user",
  password: "x79U393nDALkG7WcjlF4OvpVlea3usW9",
  database: "videeodb",
  dialectOptions: {
    ssl: {
      require: true, // Set to true to require SSL
      rejectUnauthorized: false, // Set to false to avoid rejection of self-signed certificates
    },
  },
});

module.exports = sequelize;
