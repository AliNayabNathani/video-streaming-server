const sequelize = require("./config/sequelize");
const ViewsStats = require("./models/Stats");

ViewsStats.sync({ force: true })
  .then(() => {
    console.log("Table created successfully");
    sequelize.close();
  })
  .catch((error) => {
    console.error("Error creating table:", error);
    sequelize.close();
  });
