const express = require("express");
const {
  getUsersRegisteredByMonth,
  getCreatorsRegisteredByMonth,
  getTotalVideos,
  getTotalViewsForUser,
  getTotalViewsChartData,
  getViewsGraph,
} = require("../controllers/statsController");
const router = express.Router();

//Admin graph
router.route("/getuserbymonth").get(getUsersRegisteredByMonth);
router.route("/getcreatorsbymonth").get(getCreatorsRegisteredByMonth);
router.route("/getvideos").get(getTotalVideos);

//client graphs
router.route("/total-views").get(getTotalViewsForUser);

router.route("/total-views-chart").get(getViewsGraph);

module.exports = router;
