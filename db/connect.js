const { Pool } = require("pg");

const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "videoserver",
  password: "admin",
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
