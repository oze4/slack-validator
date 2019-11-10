'use strict'
const express = require('express');
const router = express.Router();
const middleware = require('../../utils/middleware');


/**
 * @route /validate
 * 
 * @param [req.body.body] Body as string
 */
router.post("/", (req, res, next) => {
    console.log("req.rawBody");
    console.log(eq.rawBody);
    let verified = middleware.verifySlackRequest(req, res);
    res.status(200).send({ status: verified });
});

module.exports = router;
