const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "inspedium",
  database: "videoserver",
});

module.exports = sequelize;

// const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: "dpg-ckhp3a6afg7c73frctsg-a.oregon-postgres.render.com",
//   port: 5432,
//   username: "videodb_jkqb_user",
//   password: "x79U393nDALkG7WcjlF4OvpVlea3usW9",
//   database: "videodb_jkqb",
//   pool: {
//     max: 10,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

// module.exports = sequelize;
