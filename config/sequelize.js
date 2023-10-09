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
      require: true, // Set to true to require SSL
      rejectUnauthorized: false, // Set to false to avoid rejection of self-signed certificates
    },
  },
});
// dpg-ckg19n0l3its73bbg190-a.oregon-postgres.render.com
module.exports = sequelize;
