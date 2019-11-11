'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
const validateRequestIsFromSlack = require('./validator');

app.set('port', process.env.PORT);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

app.post("/validate", (req, res, next) => {
    res.status(200).send({ 
        status: validateRequestIsFromSlack(req)
    });
});

app.use((req, res, next) => res.status(500).send()); // Route not found

const server = app.listen(app.get('port'), () => {
    const _addr = server.address();
    const _prefix = _addr.port === 443 ? "https://" : "http://";
    const _host = _addr.address == "::" ? require('os').hostname : _addr.address;

    console.log(`App started on: '${_prefix}${_host}:${_addr.port}'`)
});
