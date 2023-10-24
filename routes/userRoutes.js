const express = require('express');

const {
    authenticateUser,
    authorizePermission,
} = require("../middleware/authentication");
const {
    MyVideos,
    AllChannels,
    createProfile,
    getProfiles,
    addDevice,
    getDevice,
    TermsandConditions,
    privacyPolicy
} = require('../controllers/userController');

const router = express.Router();

router.route('/getAllChannels').get(AllChannels);

router.route('/createProfile').post(authenticateUser, createProfile);

router.route('/getProfiles').get(authenticateUser, getProfiles);

router.route('/addDevice').post(authenticateUser, addDevice);

router.route('/getDevice').get(authenticateUser, getDevice);

router.route('/gettTerms').get(authenticateUser, TermsandConditions);

router.route('/getPrivacy').get(authenticateUser, privacyPolicy);

module.exports = router;
