'use strict'
const express = require('express');
const router = express.Router();
const ValidatePost = require('./post.js');

router.use(ValidatePost);

module.exports = router;