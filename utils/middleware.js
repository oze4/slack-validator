'use strict'
const { verifySlackToken, validateRequestIsFromSlack } = require('./helper');

module.exports = {
    /**
     * 
     * @param {http request} req 
     * @param {http response} res 
     * @param {buffer} buf 
     * @param {string} encoding 
     * 
     * @description Converts request body to string buffer
     */
    rawBodyBuffer(req, res, buf, encoding) {
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || 'utf8');
        }
    },

    /**
     * 
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {HttpNext} next 
     * 
     * @description Verifies the request came from Slack
     */
    verifySlackRequest(req, res) {

        if (validateRequestIsFromSlack(process.env.SIGNING_SECRET, "v0", req, res)) {
            
            if (verifySlackToken(req)) {
                //next();
                return true;
            }

            console.log("Slack verification token mismatch!");
            //res.status(200).send("Slack verification token mismatch!");
            return false;

        }

        console.log("Slack signature does not match hash!");
        //res.status(200).send("Slack signature does not match hash!");
        return false;

    },
}