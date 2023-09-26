const express = require("express");
const {
  getOverview,
  updateOverview,
  getAllAcountContent,
  updateAllAccountContent,
  getBankAndTaxInfo,
  updateBankAndTaxInfo,
  getTitleSubmission,
  updateTitleSubmission,
  getChangeTitles,
  updateChangeTitles,
} = require("../controllers/clientController");
const router = express.Router();

router.route("/get-overview").get(getOverview).patch(updateOverview);

router
  .route("/get-account")
  .get(getAllAcountContent)
  .patch(updateAllAccountContent);

router.route("/get-banking").get(getBankAndTaxInfo).patch(updateBankAndTaxInfo);

router
  .route("/get-titlesubmission")
  .get(getTitleSubmission)
  .patch(updateTitleSubmission);

router
  .route("/get-changetitles")
  .get(getChangeTitles)
  .patch(updateChangeTitles);

module.exports = router;
