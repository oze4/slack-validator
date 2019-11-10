'use strict'

/**
 * 
 * @param {Number} reqTimestamp
 * 
 * @description  Determines if X timestamp is less than five minutes old. This is done to verify the Slack request isn't older than 
 *                 five minutes. If it is, it is possible it might be a replay attack, so we drop it. 
 */
function lessThanFiveMinutesOld(reqTimestamp) {
    let FIVE_MIN = 5 * 60 * 1000;
    return ((new Date(Number(reqTimestamp))) - (new Date())) < FIVE_MIN;
}


/**
 * 
 * @param {HttpRequest} req
 * 
 * @description Verifies that the Slack Verification Token (which they send on each request to us), matches what we have. 
 */
function verifySlackToken(req) {
    let tokenInRequest = req.body.token || JSON.parse(req.body.payload).token;
    return tokenInRequest === process.env.VERIFICATION_TOKEN;
}


/**
 * 
 * @param {String} slackAppSigningSecret 
 * @param {String} slackVersionNumber 
 * @param {HttpRequest} httpReq 
 * @param {HttpResponse} httpRes 
 * 
 * @description Validates the request has not been modified en route. This is done per Slack. Slack recommends doing this per best practices. 
 *              - Taken From: https://github.com/gverni/validate-slack-request/blob/master/index.js
 */
function validateRequestIsFromSlack(slackAppSigningSecret, slackVersionNumber, httpReq, httpRes) {
    try {

        let signingSecretIsInvalid = !slackAppSigningSecret || typeof slackAppSigningSecret !== 'string' || slackAppSigningSecret === '';

        if (signingSecretIsInvalid) {
            console.log('Slack signing secret empty or not a string');
            //return httpRes.status(500).end() //.send('Slack signing secret empty or not a string');
            return false;
        }

        const SlackSignature = httpReq.get('X-Slack-Signature')

        if (!SlackSignature) {
            console.log('No Slack signature found in request');
            //return httpRes.status(500).end() //.send('No Slack signature found in request');
            return false;
        }

        const xSlackRequestTimeStamp = httpReq.get('X-Slack-Request-Timestamp')

        if (!lessThanFiveMinutesOld(xSlackRequestTimeStamp)) {
            console.log('older than five min');
            //return httpRes.status(500).end() //.send('older than five min');
            return false;
        }

        let requestBody = httpReq.rawBody || httpReq.body.payload || httpReq.body;

        console.log("requestBody" + requestBody);

        if (!(xSlackRequestTimeStamp && SlackSignature && requestBody)) {
            console.log('Invalid request from Slack');
            //return httpRes.status(500).end() //.send('Invalid request from Slack');
            return false;
        }

        const baseString = `${slackVersionNumber}:${xSlackRequestTimeStamp}:${requestBody}`;
        const hash = `${slackVersionNumber}=${crypto.createHmac('sha256', slackAppSigningSecret).update(baseString).digest('hex')}`;

        return (SlackSignature === hash);

    } catch {

        //return httpRes.status(500).end();
        return false;

    }
}

module.exports = {
    verifySlackToken,
    validateRequestIsFromSlack
}