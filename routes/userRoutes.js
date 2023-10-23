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
    getDevice
} = require('../controllers/userController');

const router = express.Router();

router.route('/getAllChannels').get(AllChannels);

router.route('/createProfile').post(authenticateUser, createProfile);

router.route('/getProfiles').get(authenticateUser, getProfiles);

router.route('/getDevice/:id').get(authenticateUser, getDevice);
module.exports = router;
