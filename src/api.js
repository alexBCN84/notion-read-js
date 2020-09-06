const express = require('express');
const serverless = require('serverless-http');
const retrieveNotionData = require('./getData');
require('encoding');
const app = express();

const router = express.Router();

router.get('/:entry', (req, res) => {
    retrieveNotionData(req.params.entry).then(data => data)
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);

retrieveNotionData('f058d64ad56b4f318ec58ddeb26625ff').then(data => console.log(data))