const { Pool } = require("pg");

const dbConfig = {
  user: "videodb_jkqb",
  host: "dpg-ckhp3a6afg7c73frctsg-a",
  database: "videeodb",
  password: "x79U393nDALkG7WcjlF4OvpVlea3usW9",
  port: 5432,
};

const connectDB = () => {
  const pool = new Pool(dbConfig);

  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  return pool;
};

module.exports = { connectDB, dbConfig };
