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
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router
  .route("/get-overview")
  .get(authenticateUser, getOverview)
  .patch(updateOverview);

router
  .route("/get-account")
  .get(authenticateUser, getAllAcountContent)
  .patch(updateAllAccountContent);

router
  .route("/get-banking")
  .get(authenticateUser, getBankAndTaxInfo)
  .patch(updateBankAndTaxInfo);

router
  .route("/get-titlesubmission")
  .get(authenticateUser, getTitleSubmission)
  .patch(updateTitleSubmission);

router
  .route("/get-changetitles")
  .get(authenticateUser, getChangeTitles)
  .patch(updateChangeTitles);

module.exports = router;
