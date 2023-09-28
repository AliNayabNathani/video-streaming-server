const express = require("express");
const {
  getUsersRegisteredByMonth,
  getCreatorsRegisteredByMonth,
  getTotalVideos,
  getTotalViewsForUser,
  getTotalViewsChartData,
  getViewsGraph,
} = require("../controllers/statsController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

//Admin graph
router
  .route("/getuserbymonth")
  .get(authenticateUser, getUsersRegisteredByMonth);
router
  .route("/getcreatorsbymonth")
  .get(authenticateUser, getCreatorsRegisteredByMonth);
router.route("/getvideos").get(authenticateUser, getTotalVideos);

//client graphs
router.route("/total-views").get(authenticateUser, getTotalViewsForUser);

router.route("/total-views-chart").get(authenticateUser, getViewsGraph);

module.exports = router;
