const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const sequelize = require("../config/sequelize");
const User = require("../models/User");
const Role = require("../models/Role");
const Overview = require("../models/Overview");
const Account = require("../models/Account");
const BankAndTax = require("../models/BankAndTax");
const TitleSubmission = require("../models/TitleSubmission");
const ChangeTitles = require("../models/ChangeTitles");

const getOverview = async (req, res) => {
  const overviewItem = await Overview.findOne({
    where: { name: "Overview" },
  });
  const overviewData = overviewItem.description;

  res.status(StatusCodes.OK).json({ overviewData });
};

const updateOverview = async (req, res) => {
  const { overviewData } = req.body;

  if (!overviewData) {
    throw new CustomError.BadRequestError("Overview data is required.");
  }

  const overviewItem = await Overview.findOne({
    where: { name: "Overview" },
  });

  if (!overviewItem) {
    throw new CustomError.NotFoundError("Overview item not found.");
  }
  overviewItem.description = overviewData;
  await overviewItem.save();

  res
    .status(StatusCodes.OK)
    .json({ message: "Overview data updated successfully." });
};

const getAllAcountContent = async (req, res) => {
  const accountItem = await Account.findOne({
    where: { name: "Account" },
  });

  const setupAccountItem = await Account.findOne({
    where: { name: "Setup Account" },
  });
  const companyProfileItem = await Account.findOne({
    where: { name: "Company Profile" },
  });
  const userRolesItem = await Account.findOne({
    where: { name: "User Roles" },
  });

  const accountData = accountItem.description;
  const setupAccount = setupAccountItem.description;
  const companyProfile = companyProfileItem.description;
  const userRoles = userRolesItem.description;

  res
    .status(StatusCodes.OK)
    .json({ accountData, setupAccount, companyProfile, userRoles });
};

const updateAllAccountContent = async (req, res) => {
  const { accountData, setupAccount, companyProfile, userRoles } = req.body;

  const accountItem = await Account.findOne({
    where: { name: "Account" },
  });

  const setupAccountItem = await Account.findOne({
    where: { name: "Setup Account" },
  });

  const companyProfileItem = await Account.findOne({
    where: { name: "Company Profile" },
  });

  const userRolesItem = await Account.findOne({
    where: { name: "User Roles" },
  });

  if (
    !accountItem ||
    !setupAccountItem ||
    !companyProfileItem ||
    !userRolesItem
  ) {
    throw new CustomError.NotFoundError("One or more account items not found.");
  }

  if (accountData) {
    accountItem.description = accountData;
    await accountItem.save();
  }

  if (setupAccount) {
    setupAccountItem.description = setupAccount;
    await setupAccountItem.save();
  }

  if (companyProfile) {
    companyProfileItem.description = companyProfile;
    await companyProfileItem.save();
  }

  if (userRoles) {
    userRolesItem.description = userRoles;
    await userRolesItem.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Account content updated successfully." });
};

const getBankAndTaxInfo = async (req, res) => {
  const bankAndTaxInfo = await BankAndTax.findOne({
    where: { name: "Bank and tax information" },
  });
  const bankingInfo = await BankAndTax.findOne({
    where: { name: "Banking information" },
  });
  const taxInfo = await BankAndTax.findOne({
    where: { name: "Tax info" },
  });
  const euroContent = await BankAndTax.findOne({
    where: { name: "European content acquisition" },
  });
  const billingPref = await BankAndTax.findOne({
    where: { name: "Billing preference" },
  });

  const bankAndTaxData = bankAndTaxInfo.description;
  const bankingData = bankingInfo.description;
  const taxData = taxInfo.description;
  const euroContentData = euroContent.description;
  const billingPrefData = billingPref.description;

  res.status(StatusCodes.OK).json({
    bankAndTaxData,
    bankingData,
    taxData,
    euroContentData,
    billingPrefData,
  });
};

const updateBankAndTaxInfo = async (req, res) => {
  const {
    bankAndTaxData,
    bankingData,
    taxData,
    euroContentData,
    billingPrefData,
  } = req.body;

  const bankAndTaxDataItem = await BankAndTax.findOne({
    where: { name: "Bank and tax information" },
  });
  const bankingDataItem = await BankAndTax.findOne({
    where: { name: "Banking information" },
  });

  const taxDataItem = await BankAndTax.findOne({
    where: { name: "Tax info" },
  });

  const euroContentDataItem = await BankAndTax.findOne({
    where: { name: "European content acquisition" },
  });

  const billingPrefDataItem = await BankAndTax.findOne({
    where: { name: "Billing preference" },
  });

  if (
    !bankAndTaxDataItem ||
    !bankingDataItem ||
    !taxDataItem ||
    !euroContentDataItem ||
    !billingPrefDataItem
  ) {
    throw new CustomError.NotFoundError("One or more account items not found.");
  }

  if (bankAndTaxData) {
    bankAndTaxDataItem.description = bankAndTaxData;
    await bankAndTaxDataItem.save();
  }

  if (bankingData) {
    bankingDataItem.description = bankingData;
    await bankingDataItem.save();
  }

  if (taxData) {
    taxDataItem.description = taxData;
    await taxDataItem.save();
  }
  if (euroContentData) {
    euroContentDataItem.description = euroContentData;
    await euroContentDataItem.save();
  }
  if (billingPrefData) {
    billingPrefDataItem.description = billingPrefData;
    await billingPrefDataItem.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Banking And Tax content updated successfully." });
};

const getTitleSubmission = async (req, res) => {
  const titleSubmissionInfo = await TitleSubmission.findOne({
    where: { name: "Title submission" },
  });
  const LicInfo = await TitleSubmission.findOne({
    where: { name: "Licensing consideration and title review" },
  });
  const subReqInfo = await TitleSubmission.findOne({
    where: { name: "Submission requirements" },
  });
  const availLocInfo = await TitleSubmission.findOne({
    where: { name: "Available locations" },
  });
  const standaloneInfo = await TitleSubmission.findOne({
    where: { name: "Create a standalone title" },
  });
  const epiTitleInfo = await TitleSubmission.findOne({
    where: { name: "Create an episode title" },
  });
  const amazonInfo = await TitleSubmission.findOne({
    where: { name: "Add files from amazon S3" },
  });
  const catInfo = await TitleSubmission.findOne({
    where: { name: "Categories" },
  });
  const genreInfo = await TitleSubmission.findOne({
    where: { name: "Genre defination" },
  });

  const titleSubmissionData = titleSubmissionInfo.description;
  const LicData = LicInfo.description;
  const subReqData = subReqInfo.description;
  const availLocData = availLocInfo.description;
  const standaloneData = standaloneInfo.description;
  const epiTitleData = epiTitleInfo.description;
  const amazonData = amazonInfo.description;
  const catData = catInfo.description;
  const genreData = genreInfo.description;

  res.status(StatusCodes.OK).json({
    titleSubmissionData,
    LicData,
    subReqData,
    availLocData,
    standaloneData,
    epiTitleData,
    amazonData,
    catData,
    genreData,
  });
};

const updateTitleSubmission = async (req, res) => {
  const {
    titleSubmissionData,
    LicData,
    subReqData,
    availLocData,
    standaloneData,
    epiTitleData,
    amazonData,
    catData,
    genreData,
  } = req.body;

  const titleSubmissionInfo = await TitleSubmission.findOne({
    where: { name: "Title submission" },
  });
  const LicInfo = await TitleSubmission.findOne({
    where: { name: "Licensing consideration and title review" },
  });
  const subReqInfo = await TitleSubmission.findOne({
    where: { name: "Submission requirements" },
  });
  const availLocInfo = await TitleSubmission.findOne({
    where: { name: "Available locations" },
  });
  const standaloneInfo = await TitleSubmission.findOne({
    where: { name: "Create a standalone title" },
  });
  const epiTitleInfo = await TitleSubmission.findOne({
    where: { name: "Create an episode title" },
  });
  const amazonInfo = await TitleSubmission.findOne({
    where: { name: "Add files from amazon S3" },
  });
  const catInfo = await TitleSubmission.findOne({
    where: { name: "Categories" },
  });
  const genreInfo = await TitleSubmission.findOne({
    where: { name: "Genre defination" },
  });

  if (
    !titleSubmissionInfo ||
    !LicInfo ||
    !subReqInfo ||
    !availLocInfo ||
    !standaloneInfo ||
    !epiTitleInfo ||
    !amazonInfo ||
    !catInfo ||
    !genreInfo
  ) {
    throw new CustomError.NotFoundError("One or more account items not found.");
  }

  if (titleSubmissionData) {
    titleSubmissionInfo.description = titleSubmissionData;
    await titleSubmissionInfo.save();
  }

  if (LicData) {
    LicInfo.description = LicData;
    await LicInfo.save();
  }

  if (epiTitleData) {
    epiTitleInfo.description = epiTitleData;
    await epiTitleInfo.save();
  }
  if (subReqData) {
    subReqInfo.description = subReqData;
    await subReqInfo.save();
  }
  if (availLocData) {
    availLocInfo.description = availLocData;
    await availLocInfo.save();
  }
  if (standaloneData) {
    standaloneInfo.description = standaloneData;
    await standaloneInfo.save();
  }

  if (amazonData) {
    amazonInfo.description = amazonData;
    await amazonInfo.save();
  }
  if (catData) {
    catInfo.description = catData;
    await catInfo.save();
  }
  if (genreData) {
    genreInfo.description = genreData;
    await genreInfo.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Title Submission content updated successfully." });
};

const getChangeTitles = async (req, res) => {
  const ChangeTitlesInfo = await ChangeTitles.findOne({
    where: { name: "Change titles" },
  });
  const addOrRemoveInfo = await ChangeTitles.findOne({
    where: { name: "Add or remove seasons & episodes" },
  });
  const changeLocInfo = await ChangeTitles.findOne({
    where: {
      name: "Change location availability, pricing model, or availability dates",
    },
  });
  const availLocInfo = await ChangeTitles.findOne({
    where: { name: "Available locations" },
  });
  const standaloneInfo = await ChangeTitles.findOne({
    where: { name: "Create a standalone title" },
  });
  const epiTitleInfo = await ChangeTitles.findOne({
    where: { name: "Create an episode title" },
  });
  const amazonInfo = await ChangeTitles.findOne({
    where: { name: "Add files from amazon S3" },
  });
  const catInfo = await ChangeTitles.findOne({
    where: { name: "Categories" },
  });
  const genreInfo = await ChangeTitles.findOne({
    where: { name: "Genre defination" },
  });

  const changeTitlesData = ChangeTitlesInfo.description;
  const addOrRemoveData = addOrRemoveInfo.description;
  const changeLocData = changeLocInfo.description;
  const availLocData = availLocInfo.description;
  const standaloneData = standaloneInfo.description;
  const epiTitleData = epiTitleInfo.description;
  const amazonData = amazonInfo.description;
  const catData = catInfo.description;
  const genreData = genreInfo.description;

  res.status(StatusCodes.OK).json({
    changeTitlesData,
    addOrRemoveData,
    changeLocData,
    availLocData,
    standaloneData,
    epiTitleData,
    amazonData,
    catData,
    genreData,
  });
};

const updateChangeTitles = async (req, res) => {
  const {
    changeTitlesData,
    addOrRemoveData,
    changeLocData,
    availLocData,
    standaloneData,
    epiTitleData,
    amazonData,
    catData,
    genreData,
  } = req.body;

  const ChangeTitlesInfo = await ChangeTitles.findOne({
    where: { name: "Change titles" },
  });
  const addOrRemoveInfo = await ChangeTitles.findOne({
    where: { name: "Add or remove seasons & episodes" },
  });
  const changeLocInfo = await ChangeTitles.findOne({
    where: {
      name: "Change location availability, pricing model, or availability dates",
    },
  });
  const availLocInfo = await ChangeTitles.findOne({
    where: { name: "Available locations" },
  });
  const standaloneInfo = await ChangeTitles.findOne({
    where: { name: "Create a standalone title" },
  });
  const epiTitleInfo = await ChangeTitles.findOne({
    where: { name: "Create an episode title" },
  });
  const amazonInfo = await ChangeTitles.findOne({
    where: { name: "Add files from amazon S3" },
  });
  const catInfo = await ChangeTitles.findOne({
    where: { name: "Categories" },
  });
  const genreInfo = await ChangeTitles.findOne({
    where: { name: "Genre defination" },
  });

  if (
    !ChangeTitlesInfo ||
    !addOrRemoveInfo ||
    !changeLocInfo ||
    !availLocInfo ||
    !standaloneInfo ||
    !epiTitleInfo ||
    !amazonInfo ||
    !catInfo ||
    !genreInfo
  ) {
    throw new CustomError.NotFoundError("One or more account items not found.");
  }

  if (changeTitlesData) {
    ChangeTitlesInfo.description = changeTitlesData;
    await ChangeTitlesInfo.save();
  }

  if (addOrRemoveData) {
    addOrRemoveInfo.description = addOrRemoveData;
    await addOrRemoveInfo.save();
  }

  if (changeLocData) {
    changeLocInfo.description = changeLocData;
    await changeLocInfo.save();
  }
  if (epiTitleData) {
    epiTitleInfo.description = epiTitleData;
    await epiTitleInfo.save();
  }
  if (availLocData) {
    availLocInfo.description = availLocData;
    await availLocInfo.save();
  }
  if (standaloneData) {
    standaloneInfo.description = standaloneData;
    await standaloneInfo.save();
  }

  if (amazonData) {
    amazonInfo.description = amazonData;
    await amazonInfo.save();
  }
  if (catData) {
    catInfo.description = catData;
    await catInfo.save();
  }
  if (genreData) {
    genreInfo.description = genreData;
    await genreInfo.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Title Submission content updated successfully." });
};

module.exports = {
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
};
