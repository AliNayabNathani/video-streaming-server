const express = require('express');

const {
    authenticateUser,
    authorizePermission,
} = require("../middleware/authentication");
const { MyVideos, AllChannels } = require('../controllers/userController');

const router = express.Router();

router.route('/getAllChannels').get(AllChannels);

module.exports = router;
