'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
const middleware = require('./utils/middleware');
const ValidateController = require('./controllers/validate');

app.set('port', process.env.PORT);
app.use(express.urlencoded({ 
    verify: middleware.rawBodyBuffer, 
    extended: false 
}));
app.use(express.json({
    verify: middleware.rawBodyBuffer
}));
app.use(helmet());
app.use("/validate", ValidateController);
app.use((req, res, next) => res.status(500).send()); // Route not found

const server = app.listen(app.get('port'), () => {
    const _addr = server.address();
    const _prefix = _addr.port === 443 ? "https://" : "http://";
    const _host = _addr.address == "::" ? require('os').hostname : _addr.address;
    console.log(`App started on: '${_prefix}${_host}:${_addr.port}'`)
});
